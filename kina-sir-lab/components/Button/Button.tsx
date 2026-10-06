import type { ButtonHTMLAttributes } from "react";
import './button.css';

export type ButtonColor = "default" | "accent";
export type ButtonSize = "small" | "medium" | "large";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  label: string;
  color?: ButtonColor;
  primary?: boolean;
  size?: ButtonSize;
};

export function Button({
  label,
  color = "default",
  primary = false,
  size = "medium",
  disabled = false,
  ...buttonProps
}: Props) {
  const variant = primary ? "accent" : color;

  return (
    <button
      className={`btn btn--${variant} btn--${size}`}
      disabled={disabled}
      {...buttonProps}
    >
      {label}
    </button>
  );
}

// export interface ButtonProps {
//   /** Is this the principal call to action on the page? */
//   primary?: boolean;
//   /** What background color to use */
//   backgroundColor?: string;
//   /** How large should the button be? */
//   size?: 'small' | 'medium' | 'large';
//   /** Button contents */
//   label: string;
//   /** Optional click handler */
//   onClick?: () => void;
// }

// /** Primary UI component for user interaction */
// export const Button = ({
//   primary = false,
//   size = 'medium',
//   backgroundColor,
//   label,
//   ...props
// }: ButtonProps) => {
//   const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
//   return (
//     <button
//       type="button"
//       className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
//       {...props}
//     >
//       {label}
//       <style jsx>{`
//         button {
//           background-color: ${backgroundColor};
//         }
//       `}</style>
//     </button>
//   );
// };
