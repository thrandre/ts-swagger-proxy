import { BrukerDetails } from "./models/BrukerDetails";
import { BrukerViewModel } from "./models/BrukerViewModel";
import { Brukerrolle } from "./models/Brukerrolle";
import { Api, ApiFactory, HttpRequest, HttpResponse, HttpOptions, ConfigureRequest } from "./proxyUtils.ts";

export default function brukerProxy(apiFactory: ApiFactory) {
	const api = apiFactory("brukerProxy");
	return {
		searchBrukere(navn: string): Promise<HttpResponse<BrukerViewModel[]>> {
			const options: HttpOptions = {
				actionKey: "Bruker_SearchBrukere",
				url: `/api/bruker`,
				emitPending: true
			};
			const query = { navn };
			const buildRequest: ConfigureRequest = req => req.query(query);
			return api.get<BrukerViewModel[]>(options, buildRequest);
		},
		getBrukerDetails(brukerId: string): Promise<HttpResponse<BrukerDetails>> {
			const options: HttpOptions = {
				actionKey: "Bruker_GetBrukerDetails",
				url: `/api/bruker/${ brukerId }`,
				emitPending: true
			};
			const buildRequest: ConfigureRequest = req => req.;
			return api.get<BrukerDetails>(options);
		},
		updatePersonalia(brukerDetails: BrukerDetails, brukerId: string): Promise<HttpResponse<any>> {
			const options: HttpOptions = {
				actionKey: "Bruker_UpdatePersonalia",
				url: `/api/bruker/${ brukerId }`,
				emitPending: true
			};
			const buildRequest: ConfigureRequest = req => req.send(brukerDetails);
			return api.put(options, buildRequest);
		},
		deleteBrukerrolle(brukerId: string, brukerrolleId: number): Promise<HttpResponse<any>> {
			const options: HttpOptions = {
				actionKey: "Bruker_DeleteBrukerrolle",
				url: `/api/bruker/${ brukerId }/delete/${ brukerrolleId }`,
				emitPending: true
			};
			const buildRequest: ConfigureRequest = req => req.;
			return api.del(options);
		},
		getBrukerrollerForPerson(personId: string): Promise<HttpResponse<Brukerrolle[]>> {
			const options: HttpOptions = {
				actionKey: "Bruker_GetBrukerrollerForPerson",
				url: `/api/bruker/${ personId }/brukerrolle`,
				emitPending: true
			};
			const buildRequest: ConfigureRequest = req => req.;
			return api.get<Brukerrolle[]>(options);
		}
	};
}