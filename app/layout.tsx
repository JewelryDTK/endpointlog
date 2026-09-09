import type {Metadata} from 'next';
import {Inter,Manrope} from 'next/font/google';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-parts';
import './globals.css';
const sans=Manrope({variable:'--font-sans-main',subsets:['latin'],display:'swap'});
const brand=Inter({variable:'--font-brand',subsets:['latin'],display:'swap'});
export const metadata:Metadata={title:{default:'EndpointLog — Practical Microsoft workplace knowledge',template:'%s · EndpointLog'},description:'Practical guides, tested builds and grounded insights for the Microsoft workplace. By Jewelry Kenepa.',robots:{index:false,follow:false},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body className={sans.variable+' '+brand.variable}><SiteHeader/>{children}<SiteFooter/></body></html>;}
