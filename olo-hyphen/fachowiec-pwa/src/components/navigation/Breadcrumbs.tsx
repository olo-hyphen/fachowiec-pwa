import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

const pathToCrumbs = (pathname: string, params: Record<string, string>) => {
  const paths = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href?: string; isCurrent?: boolean }[] = [];

  if (paths.length === 0) {
    crumbs.push({ label: 'Dashboard', href: '/' });
    return crumbs;
  }

  // Home/Dashboard
  crumbs.push({ label: 'Dashboard', href: '/' });

  if (paths[0] === 'jobs') {
    crumbs.push({ label: 'Zlecenia', href: '/jobs' });
    if (paths[1] && params.id) {
      const job = getJob(params.id);
      crumbs.push({ label: job ? job.title : 'Szczegóły zlecenia', isCurrent: true });
    }
  } else if (paths[0] === 'clients') {
    crumbs.push({ label: 'Klienci', href: '/clients' });
    if (paths[1] && params.id) {
      const client = getClient(params.id);
      crumbs.push({ label: client ? client.name : 'Szczegóły klienta', isCurrent: true });
    }
  } // Add more as needed

  return crumbs;
};

export function Breadcrumbs() {
  const location = useLocation();
  const params = useParams();

  const crumbs = pathToCrumbs(location.pathname, params);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Ścieżka nawigacyjna" role="navigation" className="hidden md:block mb-4 px-4 md:px-6 lg:px-8">
      <Breadcrumb className="glass-subtle rounded-md p-2 backdrop-blur-sm">
        <BreadcrumbList>
          {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href} className="text-sm hover:text-foreground">
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-sm">{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < crumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}