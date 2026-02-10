"use client"

import Image from "next/image"
import { Mail, Phone, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export function DirectorProfile() {
  const [showHistory, setShowHistory] = useState(false)
  const [showPositions, setShowPositions] = useState(false)

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">
              संस्थापक एवं निदेशक
            </h2>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Photo Section */}
              <div className="md:col-span-2 bg-gradient-to-br from-orange-100 to-amber-100 p-8 flex items-center justify-center">
                <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
                  <Image
                    src="/images/director.jpg"
                    alt="डॉ. रविन्द्र शुक्ल"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-1">
                      डॉ. रविन्द्र शुक्ल
                    </h3>
                  </div>

                  {/* Title */}
                  <div>
                    <p className="text-lg font-semibold text-primary">
                      संस्थापक एवं निदेशक
                    </p>
                  </div>

                  {/* Brief Bio */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      डॉ. रविन्द्र शुक्ल राष्ट्रीय स्तर के कवि, साहित्यकार, लेखक एवं विचारक हैं। वे हिंदी साहित्य के संरक्षण, संवर्धन एवं प्रचार-प्रसार के लिए आजीवन समर्पित रहे हैं। हिंदी साहित्य भारती के केंद्रीय (अंतरराष्ट्रीय) अध्यक्ष के रूप में उन्होंने राष्ट्रीय एवं अंतरराष्ट्रीय स्तर पर उल्लेखनीय योगदान दिया है।
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="flex gap-4 pt-4">
                    <a
                      href="mailto:director@sahityabharti.org"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>ईमेल करें</span>
                    </a>
                    <a
                      href="tel:+911234567890"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>फोन करें</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-foreground border-b pb-3">
              व्यक्तिगत विवरण
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">पूर्ण नाम</p>
                  <p className="font-semibold">डॉ. रविन्द्र शुक्ल</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">पिता का नाम</p>
                  <p className="font-semibold">स्व. श्री मन्नूलाल शुक्ल</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">जन्म तिथि</p>
                  <p className="font-semibold">29 मार्च 1953 (रविवार)</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">जन्म स्थान</p>
                  <p className="font-semibold">ग्राम रायपुर, पोस्ट जहानगंज</p>
                  <p className="text-sm">जनपद फर्रुखाबाद (उ.प्र.)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">कार्य क्षेत्र</p>
                  <p className="font-semibold">सनातन धर्म प्रचारक, लेखक, कवि</p>
                  <p className="text-sm">पत्रकार एवं व्याख्याता</p>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Qualifications Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-foreground border-b pb-3">
              शैक्षिक योग्यता
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">D.Lit.</div>
                <p className="text-sm text-muted-foreground">डॉक्टर ऑफ लिटरेचर</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">M.A.</div>
                <p className="text-sm text-muted-foreground">मास्टर ऑफ आर्ट्स (हिंदी)</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">LL.B.</div>
                <p className="text-sm text-muted-foreground">बैचलर ऑफ लॉ</p>
              </div>
            </div>
          </div>

          {/* Positions & Responsibilities - Expandable */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setShowPositions(!showPositions)}
              className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-2xl font-bold text-foreground">
                प्रमुख दायित्व एवं पद
              </h3>
              {showPositions ? (
                <ChevronUp className="h-6 w-6 text-primary" />
              ) : (
                <ChevronDown className="h-6 w-6 text-primary" />
              )}
            </button>
            
            {showPositions && (
              <div className="px-8 pb-8 space-y-6">
                <div className="border-l-4 border-primary pl-6 py-2">
                  <h4 className="font-bold text-lg mb-2">पूर्व राज्य मंत्री</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• कृषि, कृषि शिक्षा एवं अनुसंधान (उ.प्र. सरकार)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-6 py-2">
                  <h4 className="font-bold text-lg mb-2">पूर्व राज्य मंत्री (स्वतंत्र प्रभार)</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• बेसिक शिक्षा</li>
                    <li>• अनौपचारिक शिक्षा</li>
                    <li>• प्रौढ़ शिक्षा एवं प्रशिक्षण</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-6 py-2">
                  <h4 className="font-bold text-lg mb-2">विधायक एवं राजनीतिक पद</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• चार बार लगातार झांसी से विधायक</li>
                    <li>• भाजपा प्रदेश मंत्री</li>
                    <li>• अधिष्ठाता – 3070 विधानसभा</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Historical Contributions - Expandable */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-2xl font-bold text-foreground">
                संक्षिप्त ऐतिहासिक योगदान
              </h3>
              {showHistory ? (
                <ChevronUp className="h-6 w-6 text-primary" />
              ) : (
                <ChevronDown className="h-6 w-6 text-primary" />
              )}
            </button>
            
            {showHistory && (
              <div className="px-8 pb-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        1990–1992
                      </span>
                    </div>
                    <div className="flex-1 border-l-2 border-primary pl-6 pb-6">
                      <h4 className="font-bold mb-2">राम मंदिर आंदोलन</h4>
                      <p className="text-muted-foreground">सक्रिय भूमिका, तीन बार कारावास</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        1989–2002
                      </span>
                    </div>
                    <div className="flex-1 border-l-2 border-primary pl-6 pb-6">
                      <h4 className="font-bold mb-2">विधानसभा प्रतिनिधित्व</h4>
                      <p className="text-muted-foreground">झांसी का चार बार विधानसभा में प्रतिनिधित्व</p>
                      <p className="text-muted-foreground">उत्तर प्रदेश सरकार में तीन बार मंत्री परिषद सदस्य</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        1983–1988
                      </span>
                    </div>
                    <div className="flex-1 border-l-2 border-primary pl-6 pb-6">
                      <h4 className="font-bold mb-2">उद्योग एवं व्यवसाय</h4>
                      <p className="text-muted-foreground">उद्योग एवं व्यवसाय क्षेत्र में सक्रिय योगदान</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        1978–1983
                      </span>
                    </div>
                    <div className="flex-1 border-l-2 border-primary pl-6 pb-6">
                      <h4 className="font-bold mb-2">श्रमिक नेतृत्व</h4>
                      <p className="text-muted-foreground">एडवोकेट एवं श्रमिक नेता</p>
                      <p className="text-muted-foreground">भारतीय मजदूर संघ अध्यक्ष</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        1975–1977
                      </span>
                    </div>
                    <div className="flex-1 border-l-2 border-primary pl-6 pb-6">
                      <h4 className="font-bold mb-2">आपातकाल विरोधी आंदोलन</h4>
                      <p className="text-muted-foreground">6 माह तक कारावास (लोकतंत्र सेनानी)</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        1974
                      </span>
                    </div>
                    <div className="flex-1 border-l-2 border-primary pl-6">
                      <h4 className="font-bold mb-2">सम्पूर्ण क्रांति आंदोलन</h4>
                      <p className="text-muted-foreground">महत्वपूर्ण भूमिका (दो बार जेल)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
