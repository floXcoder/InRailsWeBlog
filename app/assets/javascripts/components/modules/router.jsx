import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams
} from 'react-router';


export default function withRouter(options = {}) {
    const {
        location,
        params,
        searchParams,
        navigate
    } = options;

    return function router(WrappedComponent) {
        return function (initialProps) {
            const routerProps = {};

            if (location) {
                routerProps.routeLocation = useLocation();
            }

            if (params) {
                routerProps.routeParams = useParams();
            }

            if (searchParams) {
                routerProps.searchParams = useSearchParams();
            }

            if (navigate) {
                routerProps.routeNavigate = useNavigate();
            }

            return (
                <WrappedComponent {...initialProps}
                                  {...routerProps}/>
            );
        };
    };
}
