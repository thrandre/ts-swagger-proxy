export default function EksamensperiodeProxy(api) {
    return {
        getEksamensperiode(eksamensperiodeId: number, configure?) {
            return api.get("", configure);
        }
    };
}