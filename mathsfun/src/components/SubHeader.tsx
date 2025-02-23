import Link from 'next/link';
import React,{ComponentType,useId} from 'react';
import { 
    LayoutDashboard,
    Package,
    Trophy,
  } from 'lucide-react';
import { usePathname } from 'next/navigation';

const SubHeader = ()=>{

    const pathName = usePathname();
    interface SubHeadersLinks{
        title:string,
        link:string,
        isActive?:boolean,
        id:string,
        icon:ComponentType
    }


const subHeadersLinks:SubHeadersLinks[]=[
    {title:'All Apps',link:'/',isActive:false,id:useId(),icon:LayoutDashboard},
    {title:'My Apps',link:'/myapps',isActive : false,id:useId(),icon:Package},
    {title:'Achievements',link:'/achievements',isActive:false,id:useId(),icon:Trophy},
]

    return (
        <nav className='flex items-center justify-center gap-8'>
        {subHeadersLinks.map(links=>{
            const isActive = pathName === links.link;
            return(
                <Link key={links.id} href={links.link} className={`flex items-center gap-0 sm:gap-2 ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}>{links.icon && <links.icon/>}{links.title}</Link>
            )
        })}
        </nav>
    )
}
export default SubHeader;