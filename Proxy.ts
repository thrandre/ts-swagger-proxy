import eksamensperiodeProxy from "./EksamensperiodeProxy";

export default function proxy(api) {
    return {
        eksamensperiodeProxy: eksamensperiodeProxy(api)
    }
}