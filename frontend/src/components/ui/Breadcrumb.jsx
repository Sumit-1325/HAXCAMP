import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 ? (
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-ink-300" />
            ) : null}
            <li>
              {item.to ? (
                <Link to={item.to} className="transition hover:text-ink-900">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink-900">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
