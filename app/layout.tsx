import type {Metadata, Viewport} from 'next';
import {Inter,Manrope} from 'next/font/google';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-parts';
import {CookieConsent} from '@/components/cookie-consent';
import './globals.css';
const sans=Manrope({variable:'--font-sans-main',subsets:['latin'],display:'swap'});
const brand=Inter({variable:'--font-brand',subsets:['latin'],display:'swap'});
const description='Practical guides, tested builds and grounded insights for the Microsoft workplace. By Jewelry Kenepa.';
export const metadata:Metadata={
  metadataBase:new URL('https://endpointlog.com'),
  title:{default:'EndpointLog — Practical Microsoft workplace knowledge',template:'%s · EndpointLog'},
  description,
  alternates:{canonical:'/',types:{'application/rss+xml':'/feed.xml'}},
  authors:[{name:'Jewelry Kenepa',url:'https://endpointlog.com/about/'}],
  creator:'Jewelry Kenepa',
  publisher:'EndpointLog',
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  openGraph:{type:'website',locale:'en_US',siteName:'EndpointLog',url:'/',title:'EndpointLog — Practical Microsoft workplace knowledge',description,images:[{url:'/endpointlog-wordmark-color.png',alt:'EndpointLog'}]},
  twitter:{card:'summary',title:'EndpointLog — Practical Microsoft workplace knowledge',description,images:['/endpointlog-wordmark-color.png']},
  icons:{icon:'/endpointlog-mark-color.png'},
  manifest:'/manifest.webmanifest',
};
export const viewport:Viewport={themeColor:'#171b29',colorScheme:'light'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body className={sans.variable+' '+brand.variable}><SiteHeader/>{children}<SiteFooter/><CookieConsent/></body></html>;}
