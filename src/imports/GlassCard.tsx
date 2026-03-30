import svgPaths from "./svg-tmk316mgjl";

function Text() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[6px] w-[153.336px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] left-[77px] text-[12px] text-[rgba(255,255,255,0.4)] text-center top-[0.5px] whitespace-nowrap">Группа подразделений:</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[16px] left-[286.78px] top-[6px] w-[5.766px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold','Noto_Sans_Symbols2:Regular',sans-serif] font-semibold leading-[16px] left-[3.5px] text-[12px] text-[rgba(255,255,255,0.3)] text-center top-[0.5px] whitespace-nowrap">▾</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] border-solid h-[30px] left-0 rounded-[14px] top-0 w-[306.547px]" data-name="Dropdown">
      <Text />
      <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] left-[226.34px] text-[12px] text-[rgba(255,255,255,0.8)] text-center top-[6.5px] whitespace-nowrap">Дистрибьюторы</p>
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[6px] w-[84.875px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] left-[42.5px] text-[12px] text-[rgba(255,255,255,0.4)] text-center top-[0.5px] whitespace-nowrap">Вид бизнеса:</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[16px] left-[227.08px] top-[6px] w-[5.766px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold','Noto_Sans_Symbols2:Regular',sans-serif] font-semibold leading-[16px] left-[3.5px] text-[12px] text-[rgba(255,255,255,0.3)] text-center top-[0.5px] whitespace-nowrap">▾</p>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] border-solid h-[30px] left-[318.55px] rounded-[14px] top-0 w-[246.844px]" data-name="Dropdown">
      <Text2 />
      <p className="-translate-x-1/2 absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] left-[162.38px] text-[12px] text-[rgba(255,255,255,0.8)] text-center top-[6.5px] whitespace-nowrap">Основной бизнес</p>
      <Text3 />
    </div>
  );
}

function Sales() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Sales">
      <Dropdown />
      <Dropdown1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] left-0 text-[12px] text-[rgba(255,255,255,0.35)] top-[0.5px] whitespace-nowrap">LFL — Продажи по месяцам, %</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[2.5%_1.67%_26%_21.74%]" data-name="Group">
      <div className="absolute inset-[-0.35%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 229 144">
          <g id="Group">
            <path d="M0 143.5H229" id="Vector" stroke="var(--stroke-0, #475569)" strokeDasharray="3 3" strokeOpacity="0.2" />
            <path d="M0 104.5H229" id="Vector_2" stroke="var(--stroke-0, #475569)" strokeDasharray="3 3" strokeOpacity="0.2" />
            <path d="M0 65.5H229" id="Vector_3" stroke="var(--stroke-0, #475569)" strokeDasharray="3 3" strokeOpacity="0.2" />
            <path d="M0 0.5H229" id="Vector_4" stroke="var(--stroke-0, #475569)" strokeDasharray="3 3" strokeOpacity="0.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[2.5%_1.67%_26%_21.74%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[76.4%_69.28%_17.1%_23.7%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[76.4%_69.28%_17.1%_23.7%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">Сен</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[76.4%_58.34%_17.1%_34.64%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[76.4%_58.34%_17.1%_34.64%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">Окт</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[76.4%_47.4%_17.1%_45.58%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[76.4%_47.4%_17.1%_45.58%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">Ноя</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[76.4%_36.45%_17.1%_56.52%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[76.4%_36.45%_17.1%_56.52%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">Дек</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[76.4%_25.68%_17.1%_67.63%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[76.4%_25.68%_17.1%_67.63%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">Янв</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[76.4%_14.41%_17.1%_78.24%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[76.4%_14.41%_17.1%_78.24%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">Фев</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[76.4%_3.3%_17.1%_89.01%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[76.4%_3.3%_17.1%_89.01%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">Мар</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[76.4%_3.3%_17.1%_23.7%]" data-name="Group">
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
      <Group10 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[76.4%_3.3%_17.1%_23.7%]" data-name="Group">
      <Group3 />
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[70.45%_80.94%_23.05%_12.04%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[70.45%_80.94%_23.05%_12.04%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-right whitespace-nowrap">-3%</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[50.95%_80.94%_42.55%_13.71%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[50.95%_80.94%_42.55%_13.71%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-right whitespace-nowrap">0%</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[31.45%_80.94%_62.05%_13.71%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[31.45%_80.94%_62.05%_13.71%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-right whitespace-nowrap">3%</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[0.58%_80.94%_92.92%_13.71%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[0.58%_80.94%_92.92%_13.71%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-right whitespace-nowrap">8%</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[0.58%_80.94%_23.05%_12.04%]" data-name="Group">
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[0.58%_80.94%_23.05%_12.04%]" data-name="Group">
      <Group12 />
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute inset-[54.5%_1.67%_45.5%_21.74%]" data-name="Group">
      <div className="absolute inset-[-0.5px_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 229 1">
          <g id="Group">
            <path d="M0 0.5H229" id="Vector" stroke="var(--stroke-0, white)" strokeOpacity="0.15" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute inset-[54.5%_73.49%_31.85%_22.83%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 27.3">
        <g id="Group">
          <path d={svgPaths.p2935c300} fill="var(--fill-0, white)" fillOpacity="0.15" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute inset-[42.8%_62.55%_45.5%_33.77%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 23.4">
        <g id="Group">
          <path d={svgPaths.p96a7700} fill="var(--fill-0, white)" fillOpacity="0.15" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute inset-[33.7%_51.61%_45.5%_44.72%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 41.6">
        <g id="Group">
          <path d={svgPaths.p1f795780} fill="var(--fill-0, white)" fillOpacity="0.15" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute inset-[54.5%_40.66%_35.75%_55.66%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 19.5">
        <g id="Group">
          <path d={svgPaths.p365ea600} fill="var(--fill-0, white)" fillOpacity="0.15" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute inset-[40.85%_29.72%_45.5%_66.6%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 27.3">
        <g id="Group">
          <path d={svgPaths.p3705d700} fill="var(--fill-0, white)" fillOpacity="0.15" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute inset-[23.3%_18.78%_45.5%_77.54%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 62.4">
        <g id="Group">
          <path d={svgPaths.p33872280} fill="var(--fill-0, white)" fillOpacity="0.15" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute inset-[29.15%_7.84%_45.5%_88.48%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 50.7">
        <g id="Group">
          <path d={svgPaths.p1e3b7580} fill="var(--fill-0, white)" fillOpacity="0.15" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-[23.3%_7.84%_31.85%_22.83%]" data-name="Group">
      <Group21 />
      <Group22 />
      <Group23 />
      <Group24 />
      <Group25 />
      <Group26 />
      <Group27 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[23.3%_7.84%_31.85%_22.83%]" data-name="Group">
      <Group20 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[23.3%_7.84%_31.85%_22.83%]" data-name="Group">
      <Group19 />
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute inset-[54.5%_73.49%_31.85%_22.83%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 27.3">
        <g id="Group">
          <path d={svgPaths.p2935c300} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute inset-[42.8%_62.55%_45.5%_33.77%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 23.4">
        <g id="Group">
          <path d={svgPaths.p96a7700} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute inset-[33.7%_51.61%_45.5%_44.72%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 41.6">
        <g id="Group">
          <path d={svgPaths.p1f795780} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute inset-[54.5%_40.66%_35.75%_55.66%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 19.5">
        <g id="Group">
          <path d={svgPaths.p365ea600} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute inset-[40.85%_29.72%_45.5%_66.6%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 27.3">
        <g id="Group">
          <path d={svgPaths.p3705d700} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute inset-[23.3%_18.78%_45.5%_77.54%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 62.4">
        <g id="Group">
          <path d={svgPaths.p33872280} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute inset-[29.15%_7.84%_45.5%_88.48%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 50.7">
        <g id="Group">
          <path d={svgPaths.p1e3b7580} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute contents inset-[23.3%_7.84%_31.85%_22.83%]" data-name="Group">
      <Group31 />
      <Group32 />
      <Group33 />
      <Group34 />
      <Group35 />
      <Group36 />
      <Group37 />
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute contents inset-[23.3%_7.84%_31.85%_22.83%]" data-name="Group">
      <Group30 />
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute contents inset-[23.3%_7.84%_31.85%_22.83%]" data-name="Group">
      <Group29 />
    </div>
  );
}

function Surface() {
  return (
    <div className="absolute h-[200px] left-0 overflow-clip top-0 w-[299px]" data-name="Surface">
      <Group />
      <Group2 />
      <Group11 />
      <Group17 />
      <Group18 />
      <Group28 />
    </div>
  );
}

function Surface1() {
  return (
    <div className="absolute left-0 size-[10px] top-[4.11px]" data-name="Surface">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Surface">
          <path d="M0 1.25H10V8.75H0V1.25Z" fill="var(--fill-0, white)" fillOpacity="0.15" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ListItem() {
  return (
    <div className="absolute h-[16.5px] left-[44.88px] top-0 w-[92.953px]" data-name="List Item">
      <Surface1 />
      <p className="-translate-x-1/2 absolute font-['Montserrat:Regular',sans-serif] font-normal leading-[16.5px] left-[53.5px] text-[11px] text-[rgba(255,255,255,0.15)] text-center top-[-0.5px] whitespace-nowrap">Прошлый год</p>
    </div>
  );
}

function Surface2() {
  return (
    <div className="absolute left-0 size-[10px] top-[4.11px]" data-name="Surface">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Surface">
          <path d="M0 1.25H10V8.75H0V1.25Z" fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="absolute h-[16.5px] left-[147.83px] top-0 w-[86.289px]" data-name="List Item">
      <Surface2 />
      <p className="-translate-x-1/2 absolute font-['Montserrat:Regular',sans-serif] font-normal leading-[16.5px] left-[50.5px] text-[11px] text-[rgba(255,255,255,0.92)] text-center top-[-0.5px] whitespace-nowrap">Текущий год</p>
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute h-[16.5px] left-[5px] opacity-70 top-[178.5px] w-[289px]" data-name="Legend">
      <ListItem />
      <ListItem1 />
    </div>
  );
}

function BarChart() {
  return (
    <div className="h-[200px] relative shrink-0 w-full" data-name="BarChart">
      <Surface />
      <Legend />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.03)] content-stretch flex flex-col gap-[12px] h-[262px] items-start left-0 pb-px pt-[17px] px-[17px] rounded-[14px] top-0 w-[333.328px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Paragraph />
      <BarChart />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] left-0 text-[12px] text-[rgba(255,255,255,0.35)] top-[0.5px] whitespace-nowrap">Объём продаж — Дистрибьюторы</p>
    </div>
  );
}

function Group40() {
  return (
    <div className="absolute contents inset-[87.4%_62.04%_6.1%_35.62%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_62.04%_6.1%_35.62%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">0</p>
    </div>
  );
}

function Group41() {
  return (
    <div className="absolute contents inset-[87.4%_46.07%_6.1%_49.58%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_46.07%_6.1%_49.58%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">70</p>
    </div>
  );
}

function Group42() {
  return (
    <div className="absolute contents inset-[87.4%_29.93%_6.1%_63.38%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_29.93%_6.1%_63.38%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">140</p>
    </div>
  );
}

function Group43() {
  return (
    <div className="absolute contents inset-[87.4%_15.13%_6.1%_78.51%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_15.13%_6.1%_78.51%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">210</p>
    </div>
  );
}

function Group44() {
  return (
    <div className="absolute contents inset-[87.4%_-0.08%_6.1%_93.05%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_-0.08%_6.1%_93.05%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">280</p>
    </div>
  );
}

function Group39() {
  return (
    <div className="absolute contents inset-[87.4%_-0.08%_6.1%_35.62%]" data-name="Group">
      <Group40 />
      <Group41 />
      <Group42 />
      <Group43 />
      <Group44 />
    </div>
  );
}

function Group38() {
  return (
    <div className="absolute contents inset-[87.4%_-0.08%_6.1%_35.62%]" data-name="Group">
      <Group39 />
    </div>
  );
}

function Group47() {
  return (
    <div className="absolute contents inset-[5.28%_65.89%_88.72%_20.07%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[5.28%_65.89%_88.72%_20.07%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap">Сахалин</p>
    </div>
  );
}

function Group49() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[17.28%_65.89%_66.72%_16.72%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap" data-name="Group">
      <p className="absolute inset-[17.28%_65.89%_76.72%_16.72%]">Восточная</p>
      <p className="absolute inset-[22.28%_65.89%_71.72%_21.74%]">Сибирь</p>
      <p className="absolute inset-[27.28%_65.89%_66.72%_18.73%]">Улан-Удэ</p>
    </div>
  );
}

function Group48() {
  return (
    <div className="absolute contents inset-[17.28%_65.89%_66.72%_16.72%]" data-name="Group">
      <Group49 />
    </div>
  );
}

function Group51() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[36.78%_65.89%_52.22%_13.04%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap" data-name="Group">
      <p className="absolute inset-[36.78%_65.89%_57.22%_16.72%]">Восточная</p>
      <p className="absolute inset-[41.78%_65.89%_52.22%_13.04%]">Сибирь Чита</p>
    </div>
  );
}

function Group50() {
  return (
    <div className="absolute contents inset-[36.78%_65.89%_52.22%_13.04%]" data-name="Group">
      <Group51 />
    </div>
  );
}

function Group52() {
  return (
    <div className="absolute contents inset-[56.28%_65.89%_37.72%_18.39%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[56.28%_65.89%_37.72%_18.39%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap">Камчатка</p>
    </div>
  );
}

function Group53() {
  return (
    <div className="absolute contents inset-[73.28%_65.89%_20.72%_19.73%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[73.28%_65.89%_20.72%_19.73%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap">Магадан</p>
    </div>
  );
}

function Group46() {
  return (
    <div className="absolute contents inset-[5.28%_65.89%_20.72%_13.04%]" data-name="Group">
      <Group47 />
      <Group48 />
      <Group50 />
      <Group52 />
      <Group53 />
    </div>
  );
}

function Group45() {
  return (
    <div className="absolute contents inset-[5.28%_65.89%_20.72%_13.04%]" data-name="Group">
      <Group46 />
    </div>
  );
}

function Group57() {
  return (
    <div className="absolute inset-[1.7%_5.7%_84.8%_36.79%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 171.968 27">
        <g id="Group">
          <path d={svgPaths.p281bae00} fill="var(--fill-0, #EF4444)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group58() {
  return (
    <div className="absolute inset-[18.7%_15.1%_67.8%_36.79%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 143.839 27">
        <g id="Group">
          <path d={svgPaths.p6fc00} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group59() {
  return (
    <div className="absolute inset-[35.7%_20.66%_50.8%_36.79%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 127.218 27">
        <g id="Group">
          <path d={svgPaths.p191d1b00} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group60() {
  return (
    <div className="absolute inset-[52.7%_32.85%_33.8%_36.79%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90.7786 27">
        <g id="Group">
          <path d={svgPaths.p37317800} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group61() {
  return (
    <div className="absolute inset-[69.7%_46.11%_16.8%_36.79%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51.1429 27">
        <g id="Group">
          <path d={svgPaths.p25665a00} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group56() {
  return (
    <div className="absolute contents inset-[1.7%_5.7%_16.8%_36.79%]" data-name="Group">
      <Group57 />
      <Group58 />
      <Group59 />
      <Group60 />
      <Group61 />
    </div>
  );
}

function Group55() {
  return (
    <div className="absolute contents inset-[1.7%_5.7%_16.8%_36.79%]" data-name="Group">
      <Group56 />
    </div>
  );
}

function Group54() {
  return (
    <div className="absolute contents inset-[1.7%_5.7%_16.8%_36.79%]" data-name="Group">
      <Group55 />
    </div>
  );
}

function Surface3() {
  return (
    <div className="absolute h-[200px] left-0 overflow-clip top-0 w-[299px]" data-name="Surface">
      <Group38 />
      <Group45 />
      <Group54 />
    </div>
  );
}

function BarChart1() {
  return (
    <div className="h-[200px] relative shrink-0 w-full" data-name="BarChart">
      <Surface3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.03)] content-stretch flex flex-col gap-[12px] h-[262px] items-start left-[349.33px] pb-px pt-[17px] px-[17px] rounded-[14px] top-0 w-[333.336px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Paragraph1 />
      <BarChart1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] left-0 text-[12px] text-[rgba(255,255,255,0.35)] top-[0.5px] whitespace-nowrap">Объём продаж — Основной бизнес</p>
    </div>
  );
}

function Group64() {
  return (
    <div className="absolute contents inset-[87.4%_55.35%_6.1%_42.31%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_55.35%_6.1%_42.31%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">0</p>
    </div>
  );
}

function Group65() {
  return (
    <div className="absolute contents inset-[87.4%_40.89%_6.1%_54.43%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_40.89%_6.1%_54.43%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">90</p>
    </div>
  );
}

function Group66() {
  return (
    <div className="absolute contents inset-[87.4%_26.76%_6.1%_66.89%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_26.76%_6.1%_66.89%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">180</p>
    </div>
  );
}

function Group67() {
  return (
    <div className="absolute contents inset-[87.4%_13.29%_6.1%_80.02%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_13.29%_6.1%_80.02%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">270</p>
    </div>
  );
}

function Group68() {
  return (
    <div className="absolute contents inset-[87.4%_-0.13%_6.1%_93.11%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[87.4%_-0.13%_6.1%_93.11%] leading-[normal] not-italic text-[11px] text-[rgba(148,163,184,0.5)] text-center whitespace-nowrap">360</p>
    </div>
  );
}

function Group63() {
  return (
    <div className="absolute contents inset-[87.4%_-0.13%_6.1%_42.31%]" data-name="Group">
      <Group64 />
      <Group65 />
      <Group66 />
      <Group67 />
      <Group68 />
    </div>
  );
}

function Group62() {
  return (
    <div className="absolute contents inset-[87.4%_-0.13%_6.1%_42.31%]" data-name="Group">
      <Group63 />
    </div>
  );
}

function Group72() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[2.78%_59.2%_86.22%_10.7%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap" data-name="Group">
      <p className="absolute inset-[2.78%_59.2%_91.22%_11.04%]">ЗАМОРОЖЕННЫЕ</p>
      <p className="absolute inset-[7.78%_59.2%_86.22%_10.7%]">ПОЛУФАБРИКАТЫ</p>
    </div>
  );
}

function Group71() {
  return (
    <div className="absolute contents inset-[2.78%_59.2%_86.22%_10.7%]" data-name="Group">
      <Group72 />
    </div>
  );
}

function Group74() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[17.28%_59.2%_66.72%_26.42%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap" data-name="Group">
      <p className="absolute inset-[17.28%_59.2%_76.72%_28.09%]">Мясной</p>
      <p className="absolute inset-[22.28%_59.2%_71.72%_29.1%]">проект</p>
      <p className="absolute inset-[27.28%_59.2%_66.72%_26.42%]">Ратимир</p>
    </div>
  );
}

function Group73() {
  return (
    <div className="absolute contents inset-[17.28%_59.2%_66.72%_26.42%]" data-name="Group">
      <Group74 />
    </div>
  );
}

function Group76() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[36.78%_59.2%_52.22%_19.4%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap" data-name="Group">
      <p className="absolute inset-[36.78%_59.2%_57.22%_19.4%]">КОЛБАСНЫЕ</p>
      <p className="absolute inset-[41.78%_59.2%_52.22%_24.41%]">ИЗДЕЛИЯ</p>
    </div>
  );
}

function Group75() {
  return (
    <div className="absolute contents inset-[36.78%_59.2%_52.22%_19.4%]" data-name="Group">
      <Group76 />
    </div>
  );
}

function Group77() {
  return (
    <div className="absolute contents inset-[56.28%_59.2%_37.72%_17.73%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[56.28%_59.2%_37.72%_17.73%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap">ДЕЛИКАТЕСЫ</p>
    </div>
  );
}

function Group79() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[70.78%_59.2%_18.22%_10.7%] leading-[normal] not-italic text-[10px] text-[rgba(100,116,139,0.3)] text-right whitespace-nowrap" data-name="Group">
      <p className="absolute inset-[70.78%_59.2%_23.22%_13.71%]">ОХЛАЖДЕННЫЕ</p>
      <p className="absolute inset-[75.78%_59.2%_18.22%_10.7%]">ПОЛУФАБРИКАТЫ</p>
    </div>
  );
}

function Group78() {
  return (
    <div className="absolute contents inset-[70.78%_59.2%_18.22%_10.7%]" data-name="Group">
      <Group79 />
    </div>
  );
}

function Group70() {
  return (
    <div className="absolute contents inset-[2.78%_59.2%_18.22%_10.7%]" data-name="Group">
      <Group71 />
      <Group73 />
      <Group75 />
      <Group77 />
      <Group78 />
    </div>
  );
}

function Group69() {
  return (
    <div className="absolute contents inset-[2.78%_59.2%_18.22%_10.7%]" data-name="Group">
      <Group70 />
    </div>
  );
}

function Group83() {
  return (
    <div className="absolute inset-[1.7%_3.79%_84.8%_43.48%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 157.675 27">
        <g id="Group">
          <path d={svgPaths.p35cf1900} fill="var(--fill-0, #EF4444)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group84() {
  return (
    <div className="absolute inset-[18.7%_7.48%_67.8%_43.48%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 146.633 27">
        <g id="Group">
          <path d={svgPaths.pe368c00} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group85() {
  return (
    <div className="absolute inset-[35.7%_10.73%_50.8%_43.48%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 136.917 27">
        <g id="Group">
          <path d={svgPaths.p3207eb80} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group86() {
  return (
    <div className="absolute inset-[52.7%_30.67%_33.8%_43.48%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 77.2917 27">
        <g id="Group">
          <path d={svgPaths.pd24700} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group87() {
  return (
    <div className="absolute inset-[69.7%_38.06%_16.8%_43.48%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55.2083 27">
        <g id="Group">
          <path d={svgPaths.p1be06d80} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group82() {
  return (
    <div className="absolute contents inset-[1.7%_3.79%_16.8%_43.48%]" data-name="Group">
      <Group83 />
      <Group84 />
      <Group85 />
      <Group86 />
      <Group87 />
    </div>
  );
}

function Group81() {
  return (
    <div className="absolute contents inset-[1.7%_3.79%_16.8%_43.48%]" data-name="Group">
      <Group82 />
    </div>
  );
}

function Group80() {
  return (
    <div className="absolute contents inset-[1.7%_3.79%_16.8%_43.48%]" data-name="Group">
      <Group81 />
    </div>
  );
}

function Surface4() {
  return (
    <div className="absolute h-[200px] left-0 overflow-clip top-0 w-[299px]" data-name="Surface">
      <Group62 />
      <Group69 />
      <Group80 />
    </div>
  );
}

function BarChart2() {
  return (
    <div className="h-[200px] relative shrink-0 w-full" data-name="BarChart">
      <Surface4 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.03)] content-stretch flex flex-col gap-[12px] h-[262px] items-start left-[698.66px] pb-px pt-[17px] px-[17px] rounded-[14px] top-0 w-[333.336px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Paragraph2 />
      <BarChart2 />
    </div>
  );
}

function Sales1() {
  return (
    <div className="h-[262px] relative shrink-0 w-full" data-name="Sales">
      <Container1 />
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[308px] items-start relative shrink-0 w-full" data-name="Container">
      <Sales />
      <Sales1 />
    </div>
  );
}

export default function GlassCard() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] relative rounded-[16px] size-full" data-name="GlassCard">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-px pt-[15px] px-[21px] relative rounded-[inherit] size-full">
        <Container />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.3)]" />
    </div>
  );
}