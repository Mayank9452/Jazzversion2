import{r as d,j as e}from"./index-DQkyK_Bg.js";import{L as a}from"./mockData-CFswUJMN.js";function c({weeklyUsers:n,monthlyUsers:o}){const[t,s]=d.useState("weekly"),i=t==="weekly"?n:o;return e.jsxs("div",{className:"glass-card rounded-2xl p-5 card-shadow ",children:[e.jsxs("div",{className:"relative flex w-fit rounded-xl bg-black/20 p-1 mb-4 m-auto",children:[e.jsx("span",{className:`absolute top-1 bottom-1 w-1/2 rounded-lg transition-all duration-300
      bg-[var(--gradient-pink-orange)]
      ${t==="weekly"?"left-1":"left-1/2"}
    `}),e.jsx("button",{onClick:()=>s("weekly"),className:`relative z-10 px-5 py-1.5 text-sm font-bold rounded-lg
      transition-colors
      ${t==="weekly"?"text-pink-700 bg-white":"text-white"}
    `,children:"Weekly"}),e.jsx("button",{onClick:()=>s("monthly"),className:`relative z-10 px-5 py-1.5 text-sm font-bold rounded-lg
      transition-colors
      ${t==="monthly"?"text-pink-700 bg-white":"text-white"}
    `,children:"Monthly"})]}),e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h2",{className:"text-lg font-extrabold leading-tight text-yellow-400",children:"🏆 Top Bidders"}),e.jsx("button",{onClick:()=>s("monthly"),className:`relative z-10 px-5 py-1.5 text-sm font-bold rounded-lg text-pink-700 bg-white
      transition-colors`,children:"View All"})]}),e.jsx("div",{className:"space-y-3",children:i.map((l,r)=>e.jsxs("div",{className:"flex justify-between items-center bg-muted/40 rounded-xl px-4 py-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("span",{className:"font-extrabold text-gradient-gold",children:["#",r+1]}),e.jsx("span",{className:"text-sm font-semibold",children:l.name})]}),e.jsx("span",{className:"font-bold text-gradient-green",children:l.score})]},l.id))})]})}function b(){return e.jsxs("div",{className:"mobile-container px-4 py-6",children:[e.jsx("h1",{className:"text-xl font-bold mb-6",children:"Leaderboard"}),e.jsx(c,{weeklyUsers:a,monthlyUsers:a})]})}export{b as default};
