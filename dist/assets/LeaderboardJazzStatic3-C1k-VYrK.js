import{u as x,j as e,d as m}from"./index-B4-NMHM3.js";const t=[{rank:1,name:"Jordyn Kenter",score:96239,avatar:"/assets/users/1.png"},{rank:2,name:"Alena Bator",score:84787,avatar:"/assets/users/2.png"},{rank:3,name:"Carl Oliver",score:82139,avatar:"/assets/users/3.png"},{rank:4,name:"Davis Curtis",score:80857,avatar:"/assets/users/4.png"},{rank:5,name:"Isona Othid",score:76128,avatar:"/assets/users/5.png"},{rank:6,name:"Makenna George",score:71667,avatar:"/assets/users/6.png",isCurrentUser:!0},{rank:7,name:"Kianna Batista",score:68439,avatar:"/assets/users/7.png"},{rank:8,name:"Maxith Cullep",score:66981,avatar:"/assets/users/8.png"},{rank:9,name:"Zain Dias",score:50546,avatar:"/assets/users/9.png"}],i=r=>r.toLocaleString(),h=r=>r===1?"1st":r===2?"2nd":r===3?"3rd":`${r}th`,b=t.find(r=>r.rank===1),u=t.find(r=>r.rank===2),p=t.find(r=>r.rank===3),j=t.filter(r=>r.rank>3),f=({className:r=""})=>e.jsxs("svg",{className:r,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("circle",{cx:"12",cy:"12",r:"9",stroke:"#ff5da8",strokeWidth:"2"}),e.jsx("circle",{cx:"12",cy:"12",r:"5",stroke:"#ff5da8",strokeWidth:"1.6"})]}),v=({className:r=""})=>e.jsxs("svg",{className:r,viewBox:"0 0 24 24",fill:"none",stroke:"#00E7FF",strokeWidth:"2.4",strokeLinecap:"round",children:[e.jsx("line",{x1:"4",y1:"6",x2:"20",y2:"6"}),e.jsx("line",{x1:"8",y1:"12",x2:"20",y2:"12"}),e.jsx("line",{x1:"12",y1:"18",x2:"20",y2:"18"})]}),o=({className:r=""})=>e.jsx("svg",{className:r,viewBox:"0 0 20 20",fill:"#27D980",children:e.jsx("path",{d:"M10 1L1 10L10 19L19 10L10 1Z"})}),c=({rank:r,gold:s=!1})=>e.jsxs("div",{className:"relative w-16 h-16 flex items-center justify-center",children:[e.jsxs("svg",{className:"absolute inset-0",viewBox:"0 0 64 64",children:[e.jsx("path",{d:`M22 50\r
             C10 42 9 24 22 14`,stroke:s?"#FDBA2D":"#D4D8E8",strokeWidth:"2.2",fill:"none",strokeLinecap:"round"}),e.jsx("path",{d:`M42 50\r
             C54 42 55 24 42 14`,stroke:s?"#FDBA2D":"#D4D8E8",strokeWidth:"2.2",fill:"none",strokeLinecap:"round"}),[[20,42],[18,35],[18,28],[20,21],[44,42],[46,35],[46,28],[44,21]].map(([n,a],d)=>e.jsx("circle",{cx:n,cy:a,r:"1.8",fill:s?"#FDBA2D":"#D4D8E8"},d))]}),e.jsx("div",{className:"absolute text-white font-bold text-lg",children:h(r)})]}),l=({player:r,position:s})=>{const n=s===1,a=s===1?"from-[#E5B541] via-[#8B6428] to-[#35241A]":s===2?"from-[#538FFF] via-[#274E91] to-[#1A1736]":"from-[#C97A2B] via-[#7D4318] to-[#261623]";return e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsxs("div",{className:`
        relative
        overflow-hidden
        rounded-t-3xl
        rounded-b-2xl
        bg-gradient-to-b
        ${a}
        border
        border-white/10
        shadow-2xl
        ${n?"w-[118px] h-[190px]":"w-[100px] h-[165px]"}
      `,children:[e.jsx("div",{className:"absolute top-2 left-1/2 -translate-x-1/2 z-20",children:e.jsx(c,{rank:r.rank,gold:s!==2})}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"}),e.jsx("div",{className:"absolute bottom-0 left-1/2 -translate-x-1/2",children:e.jsx("img",{src:r.avatar,alt:r.name,className:`
            object-cover
            ${n?"w-[110px] h-[110px]":"w-[95px] h-[95px]"}
          `})})]}),e.jsxs("div",{className:"mt-3 text-center",children:[e.jsx("div",{className:`${n?"text-[14px]":"text-[13px]"} font-semibold text-white`,children:r.name}),e.jsxs("div",{className:"mt-1 flex items-center justify-center gap-1",children:[e.jsx(o,{className:"w-3.5 h-3.5"}),e.jsx("span",{className:"text-[#7CFFB8] font-bold",children:i(r.score)})]})]})]})};function w(){const r=x();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:`\r
          min-h-screen\r
          max-w-md\r
          mx-auto\r
          relative\r
          overflow-hidden\r
          text-white\r
          pb-28\r
        `,style:{background:"radial-gradient(circle at top,#55206F 0%,#28124B 35%,#120B27 70%,#090514 100%)"},children:[e.jsx("div",{className:"absolute -top-44 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-fuchsia-500/20 blur-[120px]"}),e.jsxs("header",{className:"relative z-20 flex items-center justify-between px-5 pt-6 pb-8",children:[e.jsx("button",{onClick:()=>r(-1),className:"w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-95",children:e.jsx(f,{className:"w-6 h-6"})}),e.jsx("h1",{className:"text-xl font-bold tracking-wide",children:"Leaderboard"}),e.jsx("button",{className:"w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center",children:e.jsx(v,{className:"w-6 h-6"})})]}),e.jsxs("section",{className:"relative px-4",children:[e.jsx("div",{className:`\r
              absolute\r
              left-4\r
              right-4\r
              bottom-10\r
              h-[145px]\r
              rounded-[34px]\r
              bg-white/[0.04]\r
              border\r
              border-white/10\r
              backdrop-blur-xl\r
            `}),e.jsxs("div",{className:"relative z-10 flex items-end justify-center gap-3",children:[e.jsx(l,{player:u,position:2}),e.jsx("div",{className:"-mb-2",children:e.jsx(l,{player:b,position:1})}),e.jsx(l,{player:p,position:3})]})]}),e.jsxs("section",{className:`\r
            relative\r
            mt-10\r
            rounded-t-[34px]\r
            bg-white/[0.06]\r
            backdrop-blur-xl\r
            border-t\r
            border-white/10\r
            px-4\r
            pt-7\r
            pb-8\r
          `,children:[e.jsx("div",{className:"absolute -top-2 left-1/2 -translate-x-1/2",children:e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:`\r
                  w-14\r
                  h-1\r
                  rounded-full\r
                  bg-emerald-400\r
                  shadow-[0_0_20px_#3AF79E]\r
                `}),e.jsx("div",{className:`\r
                  absolute\r
                  -top-2\r
                  left-1/2\r
                  -translate-x-1/2\r
                  w-0\r
                  h-0\r
                  border-l-[8px]\r
                  border-r-[8px]\r
                  border-b-[10px]\r
                  border-l-transparent\r
                  border-r-transparent\r
                  border-b-emerald-400\r
                `})]})}),e.jsx("div",{className:"space-y-3 mt-3",children:j.map(s=>e.jsxs("div",{className:`\r
                  flex\r
                  items-center\r
                  justify-between\r
                  rounded-2xl\r
                  border\r
                  border-white/5\r
                  bg-white/[0.03]\r
                  px-4\r
                  py-3\r
                  backdrop-blur-md\r
                `,children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("img",{src:s.avatar,alt:s.name,className:`\r
                      w-12\r
                      h-12\r
                      rounded-full\r
                      object-cover\r
                      border-2\r
                      border-white/10\r
                    `}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-semibold text-[15px]",children:s.name}),s.isCurrentUser&&e.jsx("span",{className:`\r
                            text-[10px]\r
                            uppercase\r
                            px-2\r
                            py-0.5\r
                            rounded-full\r
                            bg-emerald-500/20\r
                            text-emerald-300\r
                            font-bold\r
                          `,children:"You"})]}),e.jsxs("div",{className:"flex items-center gap-1 mt-1",children:[e.jsx(o,{className:"w-3 h-3"}),e.jsx("span",{className:"text-sm font-bold text-emerald-300",children:i(s.score)})]})]})]}),e.jsx(c,{rank:s.rank})]},s.rank))}),e.jsx("div",{className:"h-6"})]}),e.jsx("div",{className:`\r
            pointer-events-none\r
            absolute\r
            bottom-0\r
            left-0\r
            right-0\r
            h-32\r
            bg-gradient-to-t\r
            from-black/50\r
            to-transparent\r
          `})]}),e.jsx(m,{})]})}export{w as default};
