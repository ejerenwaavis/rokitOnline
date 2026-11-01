import React, { useCallback, useEffect } from "react";
import {
  Link as RouterLink,
  Outlet as RROutlet,
  useLocation,
  useNavigate as useRRNavigate,
  useParams as useRRParams,
  useSearchParams,
} from "react-router-dom";

export const Outlet = RROutlet;

export function notFound() {
  const err: any = new Error("Not Found");
  err.isNotFound = true;
  return err;
}

export function useSearch(_opts?: any): Record<string, any> {
  const [searchParams] = useSearchParams();
  const obj: Record<string, any> = {};
  searchParams.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export function useParams(_opts?: any): Record<string, any> {
  return useRRParams();
}

export function useNavigate(_opts?: any) {
  const rrNavigate = useRRNavigate();
  const location = useLocation();
  return useCallback(
    (options: any) => {
      if (typeof options === "string") {
        rrNavigate(options);
        return Promise.resolve();
      }
      const currentParams = new URLSearchParams(location.search);
      const prevObj: Record<string, any> = {};
      currentParams.forEach((v, k) => {
        prevObj[k] = v;
      });
      const nextSearchObj =
        typeof options?.search === "function"
          ? options.search(prevObj)
          : options?.search !== undefined
            ? options.search
            : prevObj;
      const nextParams = new URLSearchParams();
      if (nextSearchObj && typeof nextSearchObj === "object") {
        for (const [k, v] of Object.entries(nextSearchObj)) {
          if (v !== undefined && v !== null && v !== "") {
            nextParams.set(k, String(v));
          }
        }
      }
      const qs = nextParams.toString();
      let targetPath = options?.to ?? location.pathname;
      if (options?.params && typeof options.params === "object") {
        for (const [k, v] of Object.entries(options.params)) {
          targetPath = targetPath.replace(`$${k}`, encodeURIComponent(String(v)));
        }
      }
      rrNavigate(`${targetPath}${qs ? `?${qs}` : ""}`, {
        replace: options?.replace,
        preventScrollReset: options?.resetScroll === false,
      });
      return Promise.resolve();
    },
    [rrNavigate, location.pathname, location.search]
  );
}

export const Link = React.forwardRef<HTMLAnchorElement, any>(
  ({ to, params, search, activeProps, className = "", children, ...rest }, ref) => {
    const location = useLocation();
    let resolvedPath = typeof to === "string" ? to : "/";
    if (params && typeof params === "object") {
      for (const [k, v] of Object.entries(params)) {
        resolvedPath = resolvedPath.replace(`$${k}`, encodeURIComponent(String(v)));
      }
    }
    if (resolvedPath.length > 1 && resolvedPath.endsWith("/")) {
      resolvedPath = resolvedPath.slice(0, -1);
    }
    let searchStr = "";
    if (search && typeof search === "object") {
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(search)) {
        if (v !== undefined && v !== null && v !== "") {
          sp.set(k, String(v));
        }
      }
      const qs = sp.toString();
      if (qs) searchStr = `?${qs}`;
    }
    const isActive =
      resolvedPath === "/"
        ? location.pathname === "/"
        : location.pathname === resolvedPath || location.pathname.startsWith(`${resolvedPath}/`);
    const finalClassName = [
      className,
      isActive && activeProps?.className ? activeProps.className : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <RouterLink
        ref={ref}
        to={`${resolvedPath}${searchStr}`}
        className={finalClassName}
        {...rest}
      >
        {children}
      </RouterLink>
    );
  }
);
Link.displayName = "Link";

export function useRouter() {
  return {
    invalidate: () => window.location.reload(),
  };
}

export function HeadContent() {
  return null;
}

export function Scripts() {
  return null;
}

export function createRootRouteWithContext<T = any>() {
  return (config: any) => ({
    ...config,
    useRouteContext: () => ({}),
  });
}

export function createFileRoute(_path: string) {
  return (config: any) => {
    const useLoaderData = () => {
      const params = useRRParams();
      if (config.loader) {
        return config.loader({ params });
      }
      return {};
    };

    const WrappedComponent = (props: any) => {
      const params = useRRParams();
      useEffect(() => {
        if (config.head) {
          try {
            let loaderData: any = undefined;
            if (config.loader) {
              loaderData = config.loader({ params });
            }
            const headResult = config.head({ loaderData, params });
            const titleMeta = headResult?.meta?.find((m: any) => m.title);
            if (titleMeta?.title) {
              document.title = titleMeta.title;
            }
          } catch {
            // ignore loader notFound in head effect
          }
        }
      }, [params]);

      if (!config.component) return null;
      const Comp = config.component;
      return <Comp {...props} />;
    };

    return {
      ...config,
      useSearch: () => useSearch(),
      useParams: () => useRRParams(),
      useLoaderData,
      component: WrappedComponent,
    };
  };
}
