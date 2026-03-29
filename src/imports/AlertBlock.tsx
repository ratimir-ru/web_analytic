interface AlertBlockProps {
  variant: 'green' | 'yellow' | 'red';
  title: string;
  description: string;
}

const variantStyles = {
  green: {
    bg: 'rgba(16,185,129,0.04)',
    border: 'rgba(16,185,129,0.15)',
    dotBg: '#10b981',
    dotShadow: '#10b981',
    textColor: '#10b981',
    descColor: 'rgba(255,255,255,0.55)',
  },
  yellow: {
    bg: 'rgba(245,158,11,0.04)',
    border: 'rgba(245,158,11,0.15)',
    dotBg: '#fcd34d',
    dotShadow: '#fcd34d',
    textColor: '#fcd34d',
    descColor: 'rgba(255,245,212,0.55)',
  },
  red: {
    bg: 'rgba(239,68,68,0.04)',
    border: 'rgba(239,68,68,0.15)',
    dotBg: '#ef4444',
    dotShadow: '#ef4444',
    textColor: '#ef4444',
    descColor: 'rgba(255,255,255,0.55)',
  },
};

export default function AlertBlock({ variant, title, description }: AlertBlockProps) {
  const styles = variantStyles[variant];
  
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
            style={{ color: styles.textColor }}
          >
            {title}
          </p>
        </div>
        <div className="relative shrink-0 w-full" data-name="Paragraph">
          <p 
            className="font-normal leading-[15px] not-italic text-[11px] px-[0px] py-[11px]" 
            style={{ color: styles.descColor }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}