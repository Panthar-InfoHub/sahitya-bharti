import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { parse } from "jsr:@std/csv";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Create client with Service Role Key to bypass RLS for checking positions if needed, 
// but strictly we should probably respect it. Service Role is safer for Admin tasks.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { csv_url, user_id } = body;

    if (!csv_url) {
      throw new Error("Missing csv_url in request body");
    }

    // Fetch the public CSV
    const response = await fetch(csv_url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const csvText = await response.text();

    // Parse CSV
    const rows = parse(csvText, {
      skipFirstRow: true,
      strip: true,
    });

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "No rows found in CSV" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. EXTRACT UNIQUE POSITIONS FROM CSV
    // We expect columns: state, city, position
    const incomingPositions = new Set<string>();
    const positionMap = new Map<string, { state: string; city: string; title: string }>();

    rows.forEach((row: any) => {
        const state = row.state?.trim();
        const city = row.city?.trim();
        const position = row.position?.trim();

        if (state && city && position) {
            const key = `${state.toLowerCase()}|${city.toLowerCase()}|${position.toLowerCase()}`;
            incomingPositions.add(key);
            positionMap.set(key, { state, city, title: position });
        }
    });

    // 2. FETCH EXISTING POSITIONS FROM DB
    // We fetch all positions to validate. If table is huge, we should optimize this to only fetch relevant ones,
    // but for now fetching all is safer for "bulk" consistency checks.
    const { data: existingPositionsData, error: positionError } = await supabase
        .from('positions')
        .select('state, city, title');

    if (positionError) throw positionError;

    const existingPositionSet = new Set<string>();
    existingPositionsData?.forEach((p) => {
        const key = `${p.state.toLowerCase()}|${p.city.toLowerCase()}|${p.title.toLowerCase()}`;
        existingPositionSet.add(key);
    });

    // 3. IDENTIFY MISSING POSITIONS
    const missingPositions: { state: string; city: string; title: string }[] = [];
    
    incomingPositions.forEach((key) => {
        if (!existingPositionSet.has(key)) {
            const original = positionMap.get(key);
            if (original) missingPositions.push(original);
        }
    });

    // 4. FAIL IF MISSING POSITIONS FOUND
    if (missingPositions.length > 0) {
        return new Response(
            JSON.stringify({
                error: "Some positions defined in the CSV do not exist in the database. Please create them first.",
                missing_positions: missingPositions
            }),
            {
                status: 400, // Bad Request
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    // 5. PREPARE MEMBERS FOR INSERTION
    const membersToInsert = rows.map((row: Record<string, string>) => {
      const member: any = {
        first_name: row.first_name?.trim() || null,
        last_name: row.last_name?.trim() || null,
        email: row.email?.trim() || null,
        phone_number: row.phone_number?.trim() || null,
        position: row.position?.trim() || null,
        address: row.address?.trim() || null,
        state: row.state?.trim() || null,
        nation: row.nation?.trim() || null,
        city: row.city?.trim() || null,
        profile_picture: row.profile_picture?.trim() || null,
        bio: row.bio?.trim() || null,
      };

      // Assign user_id
      if (user_id && !row.user_id) {
        member.user_id = user_id;
      } else if (row.user_id) {
        member.user_id = row.user_id;
      }

      // Enforce required fields
      if (!member.first_name || !member.last_name) {
        throw new Error("Missing required fields (first_name or last_name)");
      }
      
      return member;
    });

    // 6. BULK INSERT
    const { data, error } = await supabase
      .from("members")
      .insert(membersToInsert)
      .select();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: "Members uploaded successfully",
        count: membersToInsert.length,
        inserted: data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
