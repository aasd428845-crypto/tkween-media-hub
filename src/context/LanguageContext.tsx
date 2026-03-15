import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'en' | 'ar'
interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; isAr: boolean }

const T: Record<Lang, Record<string, string>> = {
  en: {
    nav_work:'WORK', nav_about:'ABOUT', nav_services:'SERVICES',
    nav_contact:'CONTACT', nav_quote:'GET A QUOTE',
    hero_tag:'TKWEEN FOR MEDIA PRODUCTION',
    hero_main:'We Frame the Shot', hero_sub:'So the Image Speaks',
    hero_desc:'Conference Films · Corporate Ads · Live Coverage · Aerial Filming',
    hero_cta:'VIEW OUR WORK', scroll:'SCROLL',
    work_title:'FEATURED WORK',
    f_all:'ALL', f_conf:'CONFERENCES', f_corp:'CORPORATE', f_brand:'BRAND FILMS', f_events:'EVENTS',
    srv_title:'OUR SERVICES',
    s1:'Photography', s1d:'We capture important moments with high-resolution quality.',
    s2:'Stabilized Video', s2d:'Smooth professional videos using advanced stabilization equipment.',
    s3:'Aerial Drone', s3d:'Stunning aerial angles that captivate your audience.',
    s4:'Live Coverage', s4d:'Full live broadcast with guaranteed stability and audio clarity.',
    stats_title:'BY THE NUMBERS',
    st1:'150+', st1l:'Projects Completed',
    st2:'8+', st2l:'Years Experience',
    st3:'50+', st3l:'Satisfied Clients',
    st4:'16', st4l:'Major Organizations',
    about_tag:'ABOUT TKWEEN',
    about_title:'Crafting Visual Stories That Last',
    about_body:'TKWEEN is a specialized entity in media coverage and visual documentation, with a qualified team and modern equipment. We commit to quality and precision in capturing events.',
    about_cta:'LEARN MORE →',
    why_tag:'WHY CHOOSE US',
    why_title:"We Don't Just Film — We Tell the Story",
    why_body:'Through a smart lens, refined direction, and a vision that keeps pace with the event.',
    clients_title:'OUR CLIENTS',
    clients_sub:'Honored to collaborate with elite government entities and national events.',
    contact_title:"Let's Create Something Remarkable",
    contact_sub:'Tell us about your project and we will get back to you shortly.',
    f_name:'Full Name', f_org:'Organization', f_svc:'Service Required',
    f_svc_ph:'Select a service...', f_s1:'Photography', f_s2:'Video Production',
    f_s3:'Aerial Drone', f_s4:'Live Coverage', f_s5:'Other',
    f_date:'Event Date', f_loc:'Event Location', f_det:'Additional Details',
    f_phone:'Phone Number', f_email:'Email Address', f_submit:'SEND REQUEST',
    f_ok:'Your request was sent! We will contact you soon.',
    f_err:'Something went wrong. Please try again.',
    footer_rights:'© 2025 TKWEEN For Media Production. All rights reserved.',
  },
  ar: {
    nav_work:'أعمالنا', nav_about:'عن تكوين', nav_services:'خدماتنا',
    nav_contact:'تواصل معنا', nav_quote:'طلب عرض سعر',
    hero_tag:'مؤسسة تكوين لقطة للإنتاج الفني',
    hero_main:'نُكوّن اللقطة', hero_sub:'لتتحدث الصورة',
    hero_desc:'تصوير مؤتمرات · إعلانات شركات · تغطيات مباشرة · تصوير جوي',
    hero_cta:'شاهد أعمالنا', scroll:'تمرير',
    work_title:'أبرز أعمالنا',
    f_all:'الكل', f_conf:'المؤتمرات', f_corp:'إعلانات الشركات', f_brand:'أفلام العلامات', f_events:'الفعاليات',
    srv_title:'خدماتنا',
    s1:'التصوير الفوتوغرافي', s1d:'نلتقط اللحظات المهمة بجودة عالية الدقة لتخليد الحدث.',
    s2:'تصوير فيديو بمانع اهتزاز', s2d:'فيديوهات سلسة واحترافية باستخدام معدات تثبيت متقدمة.',
    s3:'التصوير الجوي (درون)', s3d:'زوايا جوية مذهلة تمنح مشروعك منظوراً مختلفاً.',
    s4:'التغطيات المباشرة (Live)', s4d:'معدات بث مباشر متكاملة مع ضمان الاستقرار والجودة.',
    stats_title:'بالأرقام',
    st1:'+150', st1l:'مشروع منجز',
    st2:'+8', st2l:'سنوات خبرة',
    st3:'+50', st3l:'عميل راضٍ',
    st4:'16', st4l:'جهة حكومية وكبرى',
    about_tag:'عن تكوين',
    about_title:'نصنع قصصاً بصرية تُلهم',
    about_body:'مؤسسة تكوين لقطة للإنتاج الفني جهة متخصصة في التغطية الإعلامية والتوثيق البصري عبر فريق مؤهل ومعدات حديثة.',
    about_cta:'← اعرف أكثر',
    why_tag:'لماذا تختارنا؟',
    why_title:'لا نصوّر فقط — بل نروي الحكاية',
    why_body:'من خلال عدسة ذكية وإخراج متقن ورؤية تواكب الحدث.',
    clients_title:'عملاؤنا',
    clients_sub:'تشرفنا بالتعاون مع نخبة من الجهات الحكومية والشركات الكبرى.',
    contact_title:'لنصنع شيئاً استثنائياً معاً',
    contact_sub:'أخبرنا عن مشروعك وسنتواصل معك قريباً.',
    f_name:'الاسم الكامل', f_org:'اسم الجهة أو الشركة', f_svc:'نوع الخدمة',
    f_svc_ph:'اختر خدمة...', f_s1:'تصوير فوتوغرافي', f_s2:'تصوير فيديو',
    f_s3:'تصوير جوي', f_s4:'بث مباشر', f_s5:'أخرى',
    f_date:'تاريخ الفعالية', f_loc:'مكان الفعالية', f_det:'تفاصيل إضافية',
    f_phone:'رقم التواصل', f_email:'البريد الإلكتروني', f_submit:'إرسال الطلب',
    f_ok:'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.',
    f_err:'حدث خطأ. يرجى المحاولة مرة أخرى.',
    footer_rights:'© 2025 مؤسسة تكوين لقطة للإنتاج الفني. جميع الحقوق محفوظة.',
  }
}

const Ctx = createContext<LangCtx>({} as LangCtx)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  useEffect(() => {
    const s = localStorage.getItem('tkween_lang') as Lang
    if (s === 'en' || s === 'ar') setLangState(s)
  }, [])
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.body.classList.toggle('lang-ar', lang === 'ar')
  }, [lang])
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('tkween_lang', l) }
  const t = (k: string) => (T[lang] as Record<string, string>)[k] ?? k
  return <Ctx.Provider value={{ lang, setLang, t, isAr: lang === 'ar' }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
