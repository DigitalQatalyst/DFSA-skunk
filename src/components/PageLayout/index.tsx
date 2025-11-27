import React, { Fragment, ComponentType } from 'react';
import {ChevronRight, Home, MenuIcon, XIcon} from 'lucide-react';
import {useSidebar} from "../../context/SidebarContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  "data-id"?: string;
}

export function Breadcrumbs({ items, "data-id": dataId }: BreadcrumbsProps) {
  return (
    <nav
      className="flex items-center gap-2 text-sm max-w-full overflow-hidden"
      style={{ whiteSpace: "nowrap" }}
      aria-label="Breadcrumb"
      data-id={dataId}
    >
      {items.map((item, index) => {
        const normalizedHref =
          item.href === "/dashboard" ? "/dashboard/overview" : item.href;
        return (
        <Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-3 h-3 shrink-0 text-gray-400" />
          )}
          {item.current ? (
            <span className="text-gray-900 font-medium flex items-center min-w-0 truncate">
              {index === 0 && (
                <Home className="w-4 h-4 shrink-0 text-gray-400 mr-1" />
              )}
              <span className="truncate">{item.label}</span>
            </span>
          ) : (
            <a
              href={normalizedHref || "#"}
              className="text-gray-600 hover:text-gray-800 flex items-center min-w-0 truncate"
            >
              {index === 0 && (
                <Home className="w-4 h-4 shrink-0 text-gray-400 mr-1" />
              )}
              <span className="truncate">{item.label}</span>
            </a>
          )}
        </Fragment>
      )})}
    </nav>
  );
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  "data-id"?: string;
  headerClassName?: string;
  titleClassName?: string;
  headerSubtitle?: string;
}

export function PageHeader({
  title,
  breadcrumbs,
  headerSubtitle,
  "data-id": dataId,
  headerClassName = "py-6",
  titleClassName = "text-3xl font-bold text-gray-900 mt-4",
}: PageHeaderProps) {
  return (
    <div className={headerClassName} data-id={dataId}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}
      <h1 className={titleClassName}>{title}</h1>
      {headerSubtitle && (
        <p className="text-gray-600 text-sm mt-2">{headerSubtitle}</p>
      )}
    </div>
  );
}

interface PageLayoutProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerSubtitle?: string;
  children: React.ReactNode;
  "data-id"?: string;
  headerClassName?: string;
  titleClassName?: string;
  setIsOpen?: (isOpen: boolean) => void;
  isLoggedIn?: boolean;
}

export function PageLayout({
  title,
  breadcrumbs,
  headerSubtitle,
  children,
  "data-id": dataId,
  headerClassName,
  titleClassName,
}: PageLayoutProps) {
  const { isOpen: sidebarOpen, toggleSidebar } = useSidebar();
  return (
    <main
      className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50"
      style={{
        width: "100%",
        maxWidth: "100dvw",
        overscrollBehaviorX: "contain",
      }}
      data-id={dataId}
    >
      <div className="flex  ">
        {/* <button
          className="lg:hidden text-gray-600 flex-shrink-0 z-40 pl-3"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button> */}
        {/* Hard containment + responsive padding */}
        <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-6 app-clamp">
          {title && breadcrumbs ? (
            <PageHeader
              title={title}
              breadcrumbs={breadcrumbs}
              headerSubtitle={headerSubtitle}
              headerClassName={headerClassName}
              titleClassName={titleClassName}
            />
          ) : title ? (
            <div className={headerClassName}>
              <h1 className={titleClassName}>{title}</h1>
              {headerSubtitle && (
                <p className="text-gray-600 text-sm mt-2">{headerSubtitle}</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {/* min-w-0 prevents flex children from forcing horizontal overflow */}
      <div className="space-y-6 min-w-0">{children}</div>
    </main>
  );
}

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  'data-id'?: string;
  id?: string;
}

export function PageSection({ children, className = '', 'data-id': dataId, id }: PageSectionProps) {
  return (
    <div
      id={id}
      className={`bg-gray-50 shadow-sm border border-gray-200 w-full min-w-0 max-w-full overflow-x-hidden overscroll-x-contain ${className}`}
      data-id={dataId}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  'data-id'?: string;
  children?: React.ReactNode;
  headerClassName?: string;
  titleClassName?: string;
}

export function SectionHeader({
  title,
  description,
  actions,
  children,
  'data-id': dataId,
  headerClassName = 'px-4 sm:px-6 pt-4 flex items-start justify-between',
  titleClassName = 'text-lg font-semibold text-gray-900',
}: SectionHeaderProps) {
  return (
    <div className={headerClassName} data-id={dataId}>
      <div className="min-w-0">
        <h3 className={titleClassName}>{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
      {children}
    </div>
  );
}

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
  "data-id"?: string;
}

export function SectionContent({
  children,
  className = "",
  "data-id": dataId,
}: SectionContentProps) {
  return (
    <div
      className={`p-4 sm:p-6 min-w-0 max-w-full overflow-x-hidden overscroll-x-contain ${className}`}
      data-id={dataId}
    >
      {children}
    </div>
  );
}

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  "data-id"?: string;
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  "data-id": dataId,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
                inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
                text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                ${className}
            `}
      data-id={dataId}
    >
      {children}
    </button>
  );
}

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  "data-id"?: string;
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  "data-id": dataId,
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
                inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md
                text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                ${className}
            `}
      data-id={dataId}
    >
      {children}
    </button>
  );
}
