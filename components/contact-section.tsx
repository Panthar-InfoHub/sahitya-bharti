import { Phone, Mail, MapPin, Globe, Facebook, Twitter, Youtube } from "lucide-react"

export function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "मोबाइल",
      value: "+91 98765 43210",
      link: "tel:+919876543210",
    },
    {
      icon: Mail,
      title: "ई-मेल",
      value: "info@hindisahityabharti.org",
      link: "mailto:info@hindisahityabharti.org",
    },
    {
      icon: MapPin,
      title: "कार्यालय पता",
      value: "123, साहित्य मार्ग, कवि नगर, नई दिल्ली - 110001",
      link: null,
    },
    {
      icon: Globe,
      title: "वेबसाइट",
      value: "www.hindisahityabharti.org",
      link: "https://www.hindisahityabharti.org",
    },
  ]

  const socialLinks = [
    { icon: Facebook, label: "Facebook", link: "#" },
    { icon: Twitter, label: "Twitter", link: "#" },
    { icon: Youtube, label: "YouTube", link: "#" },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              संपर्क करें
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              हमसे जुड़ने या अधिक जानकारी के लिए संपर्क करें
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                संपर्क जानकारी
              </h3>
              
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon
                const content = (
                  <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-orange-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {contact.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                )

                return contact.link ? (
                  <a key={index} href={contact.link} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={index}>{content}</div>
                )
              })}

              {/* Social Media */}
              <div className="pt-6">
                <h4 className="font-semibold text-foreground mb-4">
                  सोशल मीडिया
                </h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.link}
                        className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label={social.label}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                संदेश भेजें
              </h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    नाम
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="आपका नाम"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    ई-मेल
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="आपका ई-मेल"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    विषय
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="संदेश का विषय"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    संदेश
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="अपना संदेश लिखें"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                >
                  संदेश भेजें
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
