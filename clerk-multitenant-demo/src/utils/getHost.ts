export function getHost() {
    const hostname = window.location.hostname;
    const hostSubdomain = hostname.replace(process.env.REACT_APP_HOSTNAME!, "").split(".")[0];

    if (!hostSubdomain.length) {
        return undefined;
    }
    return hostSubdomain;
}