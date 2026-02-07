-- Check if RLS is enabled and view policies
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'transactions';

-- View all policies on transactions table
SELECT * FROM pg_policies WHERE tablename = 'transactions';

-- Test if we can insert a transaction (run this to test)
-- INSERT INTO transactions (user_id, razorpay_payment_id, amount, status, type)
-- VALUES ('your-user-id-here', 'test_payment_123', 100.00, 'success', 'membership');
