import { useTheme } from "../app/components/ThemeProvider";

interface AlertBlockProps {
  variant: 'green' | 'yellow' | 'red';
  title: string;
  description: string;
}

const variantStyles = {
  green: {
    bg: 'rgba(26,141,122,0.12)',
    border: 'rgba(26,141,122,0.25)',
    dotBg: '#1A8D7A',
    dotShadow: '#1A8D7A',
    textColor: '#1A8D7A',
    descColor: 'rgba(255,255,255,0.55)',
  },
  yellow: {
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    dotBg: '#fbbf24',
    dotShadow: '#fbbf24',
    textColor: '#fbbf24',
    descColor: 'rgba(255,245,212,0.55)',
  },
  red: {
    bg: 'rgba(186,36,71,0.12)',
    border: 'rgba(186,36,71,0.25)',
    dotBg: '#ba2447',
    dotShadow: '#ba2447',
    textColor: '#ba2447',
    descColor: 'rgba(255,255,255,0.55)',
  },
};

export default function AlertBlock({ variant, title, description }: AlertBlockProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = variantStyles[variant];
  
  // Яркий и темный желтый цвет для белой темы
  const yellowLightTheme = variant === 'yellow' && !isDark ? '#d97706' : styles.textColor;
  
  return (
    <div 
      className="border border-solid relative rounded-[16px] size-full px-[78px] py-[16px] mx-[0px] hover-card" 
      style={{ 
        backgroundColor: styles.bg, 
        borderColor: styles.border,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        minHeight: '90px',
        transition: 'all 0.3s ease'
      }}
      data-name="AlertBlock"
    >
      <div 
        className="absolute left-[16px] rounded-[16777200px] size-[10px] top-[16px]" 
        style={{ 
          backgroundColor: styles.dotBg, 
          boxShadow: `0px 0px 6px 0px ${styles.dotShadow}` 
        }}
        data-name="Container" 
      />
      <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[38px] top-[14px] right-[16px]" data-name="Container">
        <div className="relative shrink-0 w-full" data-name="Paragraph">
          <p 
            className="font-semibold leading-[18px] not-italic whitespace-nowrap text-[16px] p-[0px]" 
            style={{ color: yellowLightTheme }}
          >
            {title}
          </p>
        </div>
        <div className="relative shrink-0 w-full" data-name="Paragraph">
          <p 
            className="font-normal leading-[15px] not-italic px-[0px] py-[11px] text-[12px]" 
            style={{ color: isDark ? styles.descColor : "rgba(0,0,0,0.7)" }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}