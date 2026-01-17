import type { GalleryItem, VideoItem } from "@/types/gallery"

export const imageGalleryMock: GalleryItem[] = [
  {
    id: "1",
    title: "साहित्य समारोह",
    description: "वार्षिक साहित्य समारोह का चित्र",
    imageUrl: "/literary-conference-event.jpg",
  },
  {
    id: "2",
    title: "कविता गोष्ठी",
    description: "कविताओं का आयोजन और सुनवाई",
    imageUrl: "/poetry-gathering-people.jpg",
  },
  {
    id: "3",
    title: "लेखक मिलन",
    description: "लेखकों का सामूहिक चित्र",
    imageUrl: "/authors-gathering.jpg",
  },
  {
    id: "4",
    title: "पुस्तक प्रदर्शनी",
    description: "हिंदी साहित्य की पुस्तकों की प्रदर्शनी",
    imageUrl: "/book-exhibition-display.jpg",
  },
  {
    id: "5",
    title: "साहित्य चर्चा",
    description: "साहित्य पर विचार विमर्श",
    imageUrl: "/literary-discussion-group.jpg",
  },
  {
    id: "6",
    title: "युवा लेखक कार्यशाला",
    description: "नए लेखकों के लिए प्रशिक्षण",
    imageUrl: "/young-writers-workshop.jpg",
  },
]

export const videoGalleryMock: VideoItem[] = [
  {
    id: "1",
    title: "कविता पाठ - प्रसिद्ध कवि",
    description: "प्रसिद्ध हिंदी कवि द्वारा सुंदर कविता का पाठ",
    youtubeId: "-xXrWLtBMrA?si=iZE6JYbfRNGd31MO",
    thumbnail: "/poetry-recitation.png",
  },
  {
    id: "2",
    title: "साहित्य व्याख्यान",
    description: "हिंदी साहित्य के इतिहास पर विस्तृत व्याख्यान",
    youtubeId: "pEokWhZD0P8?si=8UbKrtiPRC2rRDXP",
    thumbnail: "/literary-lecture.jpg",
  },
  {
    id: "3",
    title: "लेखक साक्षात्कार",
    description: "प्रसिद्ध लेखक का व्यक्तिगत साक्षात्कार और जीवन यात्रा",
    youtubeId: "ruaKZzRXF7w?si=lDiyyoVTeYSTZyGj",
    thumbnail: "/author-interview.jpg",
  },
  {
    id: "4",
    title: "साहित्य समारोह 2024",
    description: "वार्षिक साहित्य समारोह का मुख्य कार्यक्रम",
    youtubeId: "-xXrWLtBMrA?si=iZE6JYbfRNGd31MO",
    thumbnail: "/literature-festival.jpg",
  },
  {
    id: "5",
    title: "काव्य संगोष्ठी",
    description: "विभिन्न कवियों द्वारा आधुनिक काव्य पाठन",
    youtubeId: "pEokWhZD0P8?si=8UbKrtiPRC2rRDXP",
    thumbnail: "/poetry-seminar.jpg",
  },
  {
    id: "6",
    title: "साहित्य चर्चा",
    description: "साहित्य के विभिन्न पहलुओं पर पैनल चर्चा",
    youtubeId: "ruaKZzRXF7w?si=lDiyyoVTeYSTZyGj",
    thumbnail: "/literary-discussion.jpg",
  },
]
