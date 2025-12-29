/**
 * PermissionButton Component
 * 
 * A reusable component that wraps buttons/links with CASL permission checks.
 * When the user lacks permission, the button is disabled and shows a tooltip.
 * 
 * @example
 * <PermissionButton
 *   I="create"
 *   a="user-requests"
 *   onClick={handleCreate}
 *   className="btn-primary"
 *   tooltipMessage="You don't have permission to create requests"
 * >
 *   Create Request
 * </PermissionButton>
 */

import React from 'react';
import { Can } from './Can';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Actions, Subjects } from '../../config/abilities';

interface PermissionButtonProps {
  I: Actions;
  a: Subjects;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  tooltipMessage?: string;
  as?: 'button' | 'span';
  [key: string]: any; // Allow other props to pass through
}

export function PermissionButton({
  I,
  a,
  onClick,
  className = '',
  disabled = false,
  children,
  tooltipMessage,
  as: Component = 'button',
  ...props
}: PermissionButtonProps) {
  const defaultTooltipMessage = tooltipMessage || `You don't have permission to perform this action`;

  return (
    <Can I={I} a={a} passThrough>
      {(allowed) => {
        const isDisabled = disabled || !allowed;
        const disabledClassName = isDisabled ? 'opacity-50 cursor-not-allowed' : '';
        const combinedClassName = `${className} ${disabledClassName}`.trim();

        const buttonElement = (
          <Component
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}
            className={combinedClassName}
            aria-disabled={isDisabled}
            {...props}
          >
            {children}
          </Component>
        );

        // If disabled due to permissions, wrap with tooltip
        if (!allowed && !disabled) {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    {buttonElement}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{defaultTooltipMessage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return buttonElement;
      }}
    </Can>
  );
}


