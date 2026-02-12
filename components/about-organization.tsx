import { Building2, Calendar, FileText, Briefcase } from "lucide-react"

export function AboutOrganization() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              संगठन के बारे में
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
          </div>

          {/* Organization Details Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Establishment Year */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">स्थापना वर्ष</h3>
                  <p className="text-2xl font-bold text-primary">1985</p>
                  <p className="text-sm text-muted-foreground mt-1">चार दशकों से सेवारत</p>
                </div>
              </div>
            </div>

            {/* Registration Number */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">पंजीकरण संख्या</h3>
                  <p className="text-xl font-bold text-primary">REG/HSB/1985/001</p>
                  <p className="text-sm text-muted-foreground mt-1">सोसायटी पंजीकरण अधिनियम के अंतर्गत</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Office */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-3">पंजीकृत कार्यालय</h3>
                <p className="text-muted-foreground leading-relaxed">
                  हिंदी साहित्य भारती केंद्रीय कार्यालय<br />
                  123, साहित्य मार्ग, कवि नगर<br />
                  नई दिल्ली - 110001<br />
                  भारत
                </p>
              </div>
            </div>
          </div>

          {/* Work Areas */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">कार्य क्षेत्र</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "शिक्षा", desc: "शैक्षणिक कार्यक्रम एवं प्रशिक्षण" },
                { title: "साहित्य", desc: "साहित्यिक रचना एवं प्रकाशन" },
                { title: "संस्कृति", desc: "सांस्कृतिक संरक्षण एवं संवर्धन" },
                { title: "समाजसेवा", desc: "सामाजिक उत्थान कार्यक्रम" },
                { title: "शोध", desc: "शोध एवं अनुसंधान गतिविधियाँ" },
                { title: "राष्ट्रनिर्माण", desc: "राष्ट्रीय चेतना का विकास" },
              ].map((area, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-colors"
                >
                  <h4 className="font-bold text-lg text-primary mb-2">{area.title}</h4>
                  <p className="text-sm text-muted-foreground">{area.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
