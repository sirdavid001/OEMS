import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathContentProps {
  content: string;
  className?: string;
}

export const MathContent: React.FC<MathContentProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content by $$ (block math) and then by $ (inline math)
  const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          return <BlockMath key={index} math={math} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return <InlineMath key={index} math={math} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};
