import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  zIndex: number;
}

/**
 * Wraps a section with position:sticky so each subsequent section
 * slides up over the previous one — creating a stacked-cards parallax effect.
 * Remove the wrapper to revert for any single section.
 */
export default function StackSection({ children, zIndex }: Props) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex }}>
      {children}
    </div>
  );
}
