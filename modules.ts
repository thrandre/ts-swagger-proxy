export interface CreateAssistedLoginViewModel {
	begrunnelse: string;
	personId: string;
}

import { Adresse } from "./Adresse";
import { Brukerrolle } from "./Brukerrolle";

export interface BrukerDetails {
	personId: string;
	fornavn: string;
	etternavn: string;
	fodselsdato: string;
	mobiltelefonnummer: string;
	epost: string;
	kontonummer: string;
	adresse: Adresse;
	brukerroller: Brukerrolle[];
	foreslattSomFagpersonVedSkoler: string[];
	isSensor: boolean;
	isKlagenemndsmedlem: boolean;
	personaliaBekreftet: boolean;
	sensorpersonaliaEndringsfrist: string;
	klagepersonaliaEndringsfrist: string;
}

export interface Adresse {
	gateadresse: string;
	postnummer: string;
	poststed: string;
	land: string;
}

import { Brukertype } from "./Brukertype";

export interface Brukerrolle {
	id: number;
	brukertype: Brukertype;
	hierarchyIndex: number;
	description: string;
	enhetsnavn: string;
}

export interface Brukertype {
	name: string;
	isGlobal: boolean;
	hierarchyIndex: number;
	description: string;
}

import { Språk } from "./Språk";
import { EksamensdelBesvarelseViewModel } from "./EksamensdelBesvarelseViewModel";

export interface BesvarelsePåmeldingViewModel {
	kandidatpameldingId: number;
	kandidatnummer: string;
	malform: Språk;
	erDigital: boolean;
	erPdf: boolean;
	eksamensdelBesvarelser: EksamensdelBesvarelseViewModel[];
	besvarelsesnummer: number;
}

export interface Språk {
	description: string;
	cultureInfo: string;
}

import { BesvarelsesDocumentViewModel } from "./BesvarelsesDocumentViewModel";

export interface EksamensdelBesvarelseViewModel {
	eksamensdeltype: string;
	besvarelsesdokumenter: BesvarelsesDocumentViewModel[];
}

export interface BesvarelsesDocumentViewModel {
	besvarelsesdokumentId: string;
	fileName: string;
	plagiatStatus: number;
}

import { Brukerrolle } from "./Brukerrolle";

export interface BrukerViewModel {
	personId: string;
	fornavn: string;
	etternavn: string;
	fodselsdato: string;
	brukertype: string;
	brukerrolle: Brukerrolle;
	telefonnummer: string;
	epost: string;
}

import { KandidatWithPassord } from "./KandidatWithPassord";

export interface KandidatgruppeWithPassord {
	navn: string;
	id: number;
	kandidater: KandidatWithPassord[];
	passordGenerert: boolean;
	passordSistGenerert: string;
	antallMedPassord: number;
	antallUtenPassord: number;
	antallKandidater: number;
}

export interface KandidatWithPassord {
	kandidatId: number;
	kandidatnummer: string;
	fornavn: string;
	etternavn: string;
	passord: string;
	passordSistGenerert: string;
	passordVersion: number;
	kandidatpåmeldingId: number;
}

export interface Brukerverifisering {
	id: number;
	personId: string;
	nyEpost: string;
	verifiseringskodeEpost: string;
	nyttMobilnummer: string;
	verifiseringskodeMobil: string;
}

import { Eksamensdelinfo } from "./Eksamensdelinfo";

export interface Eksamensinfo {
	id: number;
	fagkode_Id: number;
	eksamensdeler: Eksamensdelinfo[];
	erFlestDigitale: boolean;
	fagkode: string;
	navn: string;
	kandidattyper: string[];
	antallPameldte: number;
}

import { Eksamensdeltype } from "./Eksamensdeltype";
import { EksamensmateriellViewModel } from "./EksamensmateriellViewModel";

export interface Eksamensdelinfo {
	id: number;
	eksamenId: number;
	ingenElektroniskPalogging: boolean;
	dato: string;
	fra: string;
	til: string;
	materiellTilgjengeligTidspunkt: string;
	duration: string;
	eksamensdeltype: Eksamensdeltype;
	eksamensmateriell: EksamensmateriellViewModel[];
}

export interface Eksamensdeltype {
	startTimeEuropeanTime: string;
	stoppTimeEuropeanTime: string;
}

import { Eksamensmaterielltype } from "./Eksamensmaterielltype";

export interface EksamensmateriellViewModel {
	id: number;
	eksamensdelId: number;
	eksamensmaterielltype: Eksamensmaterielltype;
	pgsaFilename: string;
	orginaltFilnavn: string;
}

import { Materielleverandør } from "./Materielleverandør";

export interface Eksamensmaterielltype {
	name: string;
	erTilrettelagt: boolean;
	beskrivelse: string;
	materielleverandør: Materielleverandør;
}

export interface Materielleverandør {

}

import { EksamensoppgaveDokumentViewModel } from "./EksamensoppgaveDokumentViewModel";

export interface EksamensoppgaveMetadataViewModel {
	eksamenId: number;
	fagkode: string;
	dokumenter: EksamensoppgaveDokumentViewModel[];
}

export interface EksamensoppgaveDokumentViewModel {
	eksamensmateriellId: number;
	orginaltFilnavn: string;
	pgsaFilename: string;
	eksamensdeltype: string;
	erPdf: boolean;
}

export interface EksamensperiodeViewModel {
	id: number;
	ar: number;
	semester: string;
	pameldingStart: string;
	pameldingStopp: string;
	gjennomforingStart: string;
	gjennomforingStopp: string;
	kode: string;
	midlertidigeSkoleadresserAktivert: boolean;
	sensorpersonaliaEndringsfrist: string;
	klagepersonaliaEndringsfrist: string;
}

import { Semester } from "./Semester";
import { SemesterAndÅr } from "./SemesterAndÅr";

export interface Eksamensperiode {
	id: number;
	år: number;
	semester: Semester;
	sentralEgBesvarelserPerSensor: number;
	sentralEvBesvarelserPerSensor: number;
	lokalVgBesvarelserPerSensor: number;
	påmeldingStartUtc: string;
	påmeldingStoppUtc: string;
	gjennomføringStartUtc: string;
	gjennomføringStoppUtc: string;
	sensoroppnevningStartUtc: string;
	klagebehandlingsfristUtc: string;
	semesterAndÅr: SemesterAndÅr;
	sensorpersonaliaEndringsfristUtc: string;
	klagepersonaliaEndringsfristUtc: string;
}

export interface Semester {
	ubestemtForm: string;
	bestemtForm: string;
}

import { Semester } from "./Semester";

export interface SemesterAndÅr {
	år: number;
	semester: Semester;
}

import { KandidatgruppeViewModel } from "./KandidatgruppeViewModel";
import { TilleggsmateriellViewModel } from "./TilleggsmateriellViewModel";

export interface EksamenspåmeldingViewModel {
	id: number;
	eksamensId: number;
	fagkode: string;
	fagnavn: string;
	kandidatgrupper: KandidatgruppeViewModel[];
	tilleggsmateriell: TilleggsmateriellViewModel[];
	etterpameldingsdato: string;
	antallPåmeldte: number;
	oppgaveansvar: string;
	sensuransvar: string;
}

import { KandidatpåmeldingViewModel } from "./KandidatpåmeldingViewModel";
import { KandidatgruppeansvarligViewModel } from "./KandidatgruppeansvarligViewModel";

export interface KandidatgruppeViewModel {
	id: number;
	navn: string;
	antallPameldinger: number;
	kandidater: KandidatpåmeldingViewModel[];
	ansvarlige: KandidatgruppeansvarligViewModel[];
}

export interface TilleggsmateriellViewModel {
	id: number;
	eksamenspameldingId: number;
	eksamensmaterielltype: string;
	antallBokmal: number;
	antallNynorsk: number;
	beskrivelse: string;
}

import { Kandidattype } from "./Kandidattype";
import { Språk } from "./Språk";

export interface KandidatpåmeldingViewModel {
	id: number;
	kandidatgruppeId: number;
	kandidatId: string;
	kandidatWithKandidatnummerId: number;
	kandidatnummer: string;
	fornavn: string;
	etternavn: string;
	kandidattype: Kandidattype;
	malform: Språk;
	harHattForsteEksamen: boolean;
	fodselsdato: string;
}

import { PersonViewModel } from "./PersonViewModel";

export interface KandidatgruppeansvarligViewModel {
	person: PersonViewModel;
	ansvarligFor: number[];
	erSkoleadministrator: boolean;
}

export interface Kandidattype {
	name: string;
}

import { Adresse } from "./Adresse";

export interface PersonViewModel {
	personId: string;
	fornavn: string;
	etternavn: string;
	adresse: Adresse;
	telefonnummerPrivat: string;
	telefonnummerArbeid: string;
	mobil: string;
	epostadresse: string;
	personaliaBekreftet: boolean;
	kontonummer: string;
}

export interface CreateFaggruppeForKlageansvar {
	fagkodeKlageansvarId: number;
	fagkodeKlageansvarNavn: string;
}

export interface UpdateFaggruppeForKlageansvar {
	faggruppenavn: string;
}

export interface AddFagkodeKlageansvarToFaggruppe {
	fagkodeKlageansvarId: number;
}

export interface CreateFaggruppeForSensuransvar {
	fagkodeSensuransvarId: number;
	fagkodeSensuransvarNavn: string;
}

export interface UpdateFaggruppeForSensuransvar {
	faggruppenavn: string;
}

export interface AddFagkodeSensuransvarToFaggruppe {
	fagkodeSensuransvarId: number;
}

export interface FagkodeInfo {
	kode: string;
	navn: string;
	oppgaveansvar: string;
	sensuransvar: string;
	numberOfPameldte: number;
	numberOfForeslatteFagpersoner: number;
	opplaeringsniva: string;
}

import { AnsvarligViewModel } from "./AnsvarligViewModel";

export interface FagkodeLokalAnsvarViewModel {
	fagkode: string;
	fagkodeNavn: string;
	oppgaveansvar: string;
	sensuransvar: string;
	ansvarlig: AnsvarligViewModel;
}

export interface AnsvarligViewModel {
	navn: string;
	epost: string;
	telefon: string;
}

import { BrukerDetails } from "./BrukerDetails";
import { TilhørighetViewModel } from "./TilhørighetViewModel";
import { Fagkompetanse } from "./Fagkompetanse";

export interface FagpersonDetaljer {
	personId: string;
	personalia: BrukerDetails;
	tilhorigheter: TilhørighetViewModel[];
	fagkompetanser: Fagkompetanse[];
	personHasPasBrukerrolle: boolean;
}

import { Tilhørighetstype } from "./Tilhørighetstype";
import { Skoleadresse } from "./Skoleadresse";

export interface TilhørighetViewModel {
	navn: string;
	organisasjonsnummer: string;
	telefon: string;
	epost: string;
	tilhorighetErLast: boolean;
	type: Tilhørighetstype;
	postadresse: Skoleadresse;
	besoksadresse: Skoleadresse;
}

import { Tilhørighetstype } from "./Tilhørighetstype";

export interface Fagkompetanse {
	fagkode: string;
	fagnavn: string;
	tilhorighetstype: Tilhørighetstype;
	tilhorighetsnavn: string;
	tilhorighetsOrganisasjonsnummer: string;
	erForeslatt: boolean;
	erOppgaveutvikler: boolean;
	oppnevningsStatus: string;
	oppgaveansvar: string;
	sensuransvar: string;
	opplaringsniva: string;
	canModifyOppgaveutviklerStatus: boolean;
}

export interface Tilhørighetstype {

}

export interface Skoleadresse {
	adresse: string;
	postnummer: string;
	poststed: string;
	land: string;
}

export interface Fagperson {
	personId: string;
	fornavn: string;
	etternavn: string;
	erForeslatt: boolean;
	erOppnevnt: boolean;
}

import { AddBruker } from "./AddBruker";

export interface AddFagpersonFagansvarligtilhørighet {
	fylkeId: number;
	personalia: AddBruker;
	personId: string;
	fornavn: string;
	etternavn: string;
	mobiltelefonnummer: string;
	epostadresse: string;
	fodselsnummer: string;
	brukertype: string;
}

export interface AddBruker {
	personId: string;
	fornavn: string;
	etternavn: string;
	mobiltelefonnummer: string;
	epostadresse: string;
	fodselsnummer: string;
	brukertype: string;
}

export interface FagpersonWithTilhørigheterAndFagkoderViewModel {
	personId: string;
	fornavn: string;
	etternavn: string;
	foreslattI: string[];
	oppgaveutviklerI: string[];
	tilhorigheter: string[];
}

export interface AddOrUpdateFagkompetanse {
	fagkode: string;
	foreslattSomSensor: boolean;
}

export interface KarakterforslagViewModel {
	karakter: number;
	kandidatpameldingId: number;
}

export interface ManglerBesvarelseViewModel {
	manglerBesvarelse: boolean;
	kandidatpameldingId: number;
}

import { OppgaveViewModel } from "./OppgaveViewModel";
import { EksamenViewModel } from "./EksamenViewModel";
import { SensuroversiktSensorparViewModel } from "./SensuroversiktSensorparViewModel";
import { SensuroversiktSensorgruppeViewModel } from "./SensuroversiktSensorgruppeViewModel";
import { SensurSensorViewModel } from "./SensurSensorViewModel";
import { BesvarelseSensurViewModel } from "./BesvarelseSensurViewModel";

export interface SensuroversiktViewModel {
	eksamensoppgaver: OppgaveViewModel[];
	eksamener: EksamenViewModel[];
	sensorparByEksamen: SensuroversiktSensorparViewModel[];
	sensorgruppe: SensuroversiktSensorgruppeViewModel[];
	sensor: SensurSensorViewModel;
	besvarelser: BesvarelseSensurViewModel[];
	shouldShowBesvarelsestype: boolean;
}

export interface OppgaveViewModel {
	eksamenId: number;
	dokumenter: any;
}

export interface EksamenViewModel {
	id: number;
	fagkodeId: number;
	fagkode: string;
	navn: string;
	plagiatkontrollTilgjengelig: boolean;
	eksamensdato: string;
	eksamenSluttDato: string;
	shouldShowBesvarelsestype: boolean;
}

import { SensurSensorViewModel } from "./SensurSensorViewModel";
import { BesvarelseSensurViewModel } from "./BesvarelseSensurViewModel";

export interface SensuroversiktSensorparViewModel {
	forsteSensor: SensurSensorViewModel;
	andreSensor: SensurSensorViewModel;
	fagnavn: string;
	ferdigMedSensur: boolean;
	besvarelser: BesvarelseSensurViewModel[];
	sensorparId: number;
	fagkode: string;
	medsensorId: number;
	eksamensId: number;
	andresensorId: number;
	forstesensorId: number;
	fellessensurApen: boolean;
}

import { SimpleSensorparViewModel } from "./SimpleSensorparViewModel";

export interface SensuroversiktSensorgruppeViewModel {
	id: number;
	sensorpar: SimpleSensorparViewModel[];
	fagkoder: string[];
	faggruppenavn: string;
}

import { PersonViewModel } from "./PersonViewModel";

export interface SensurSensorViewModel {
	personalia: PersonViewModel;
	id: number;
}

import { KandidatgruppeViewModel } from "./KandidatgruppeViewModel";
import { SimpleSkoleViewModel } from "./SimpleSkoleViewModel";

export interface BesvarelseSensurViewModel {
	erDigital: boolean;
	plagiatkontrollBestilt: boolean;
	kandidatgruppe: KandidatgruppeViewModel;
	skole: SimpleSkoleViewModel;
	eksamensId: number;
	kandidatpameldingId: number;
	endeligKarakter: number;
	plagiat: number;
	forstesensorId: number;
	andresensorId: number;
	kandidatnummer: string;
	malform: string;
	karakterforslagForstesensor: number;
	erForstesensor: boolean;
	karakterforslagAndresensor: number;
	manglerBesvarelseForstesensor: boolean;
	manglerBesvarelseAndresensor: boolean;
	endeligManglerBesvarelse: boolean;
	karakterBekreftet: boolean;
	erPdf: boolean;
	besvarelsesnummer: string;
	besvarelsesnummerSorteringsKey: number;
	medsensorId: number;
	karakterforslag: number;
	manglerBesvarelse: boolean;
	sensorparId: number;
	hasBekreftetEndeligKarakter: boolean;
}

import { SensurSensorViewModel } from "./SensurSensorViewModel";

export interface SimpleSensorparViewModel {
	gruppe: number;
	forsteSensor: SensurSensorViewModel;
	andreSensor: SensurSensorViewModel;
	medsensorId: number;
	id: number;
}

export interface SimpleSkoleViewModel {
	organisasjonsnummer: string;
	navn: string;
}

export interface BekreftEndeligKarakterViewModel {
	kandidatpameldingIds: number[];
}

export interface GenerateFiktivtFodselsnummerModel {
	fodselsdato: string;
	kjonn: string;
}

export interface FylkeViewModel {
	fylkeId: number;
	navn: string;
}

export interface Fylkeskommune {
	organisasjonsnummer: string;
	navn: string;
	epost: string;
	telefonnummer: string;
}

export interface FylkesmannViewModel {
	organisasjonsnummer: string;
	navn: string;
	epost: string;
	telefonnummer: string;
	adresse: string;
	postnummer: string;
	poststed: string;
	land: string;
}

import { KlagenemndsmedlemWithHonorarregningKlageViewModel } from "./KlagenemndsmedlemWithHonorarregningKlageViewModel";
import { HonorarregningFilViewModel } from "./HonorarregningFilViewModel";

export interface KlagehonorarOversiktFylkesmann {
	klagenemndsmedlemmer: KlagenemndsmedlemWithHonorarregningKlageViewModel[];
	honorarregningFiler: HonorarregningFilViewModel[];
}

import { Adresse } from "./Adresse";
import { HonorarregningKlageViewModel } from "./HonorarregningKlageViewModel";

export interface KlagenemndsmedlemWithHonorarregningKlageViewModel {
	id: number;
	personId: string;
	fornavn: string;
	etternavn: string;
	kontonummer: string;
	adresse: Adresse;
	faggruppenavn: string;
	honorarregning: HonorarregningKlageViewModel;
}

export interface HonorarregningFilViewModel {
	id: number;
	lopenummer: number;
	generertDate: string;
	antallRegninger: number;
}

import { PersonViewModel } from "./PersonViewModel";
import { FylkesmannViewModel } from "./FylkesmannViewModel";
import { HonorarpostViewModel } from "./HonorarpostViewModel";
import { PersonInfo } from "./PersonInfo";
import { HonorarregningFilViewModel } from "./HonorarregningFilViewModel";

export interface HonorarregningKlageViewModel {
	klagenemndsmedlemId: number;
	id: number;
	faggruppenavn: string;
	ansvarsomrade: string;
	eksamensperiode: string;
	erLevert: boolean;
	status: number;
	alleKaraktererBekreftet: boolean;
	totalt: number;
	personalia: PersonViewModel;
	fylkesmann: FylkesmannViewModel;
	honorarposter: HonorarpostViewModel[];
	attestertAv: PersonInfo;
	budsjettdisponertAv: PersonInfo;
	levertAv: PersonInfo;
	fil: HonorarregningFilViewModel;
}

export interface HonorarpostViewModel {
	id: number;
	fagkode: string;
	minutterForForarbeid: number;
	antallBesvarelser: number;
	minutterPerBesvarelse: number;
	antallMinutter: number;
	timesats: number;
	belop: number;
	beskrivelse: string;
	honorarposttype: string;
}

export interface PersonInfo {
	personId: string;
	fornavn: string;
	etternavn: string;
}

export interface EkstraBesvarelserActionModel {
	navn: string;
	fagkode: string;
	antallEkstraBesvarelser: number;
}

export interface AddHonorarregningSensurTilleggspostViewModel {
	sensorId: number;
	beskrivelse: string;
	belop: string;
}

export interface KandidatWithPåmeldingshistorikk {
	fornavn: string;
	etternavn: string;
	malform: string;
	kandidattype: string;
	fodselsdato: string;
	påmeldtEksamensdato: string;
	påmeldtVedSkole: string;
	id: string;
}

export interface SetKandidatgruppeansvarlig {
	kandidatgruppeId: number;
}

export interface SetKandidatgruppeansvar {
	kandidatgruppeIds: number[];
}

import { Kandidattype } from "./Kandidattype";
import { Språk } from "./Språk";

export interface AddKandidatpåmelding {
	id: number;
	kandidatgruppeId: number;
	kandidatId: string;
	kandidatWithKandidatnummerId: number;
	kandidatnummer: string;
	fodselsnummer: string;
	fornavn: string;
	etternavn: string;
	kandidattype: Kandidattype;
	malform: Språk;
	harHattForsteEksamen: boolean;
	fodselsdato: string;
}

export interface SetKandidatdeltakelsesstatusViewModel {
	kandidatpameldingId: number;
	deltakelsesstatus: string;
}

export interface BegrunnelseViewModel {
	begrunnelse: string;
	begrunnelseSkrevetAv: string;
}

import { PersonInfo } from "./PersonInfo";

export interface SimpleKlagenemndsmedlemViewModel {
	id: number;
	person: PersonInfo;
}

import { LocalizedKlagebehandlingStandardtekster } from "./LocalizedKlagebehandlingStandardtekster";
import { ReplacementStrings } from "./ReplacementStrings";

export interface StandardteksterDto {
	bokmal: LocalizedKlagebehandlingStandardtekster;
	nynorsk: LocalizedKlagebehandlingStandardtekster;
	replacementStrings: ReplacementStrings;
}

import { Bunntekst } from "./Bunntekst";
import { Topptekst } from "./Topptekst";

export interface LocalizedKlagebehandlingStandardtekster {
	bunntekst: Bunntekst;
	topptekst: Topptekst;
	karakterbeskrivelser: object;
}

export interface ReplacementStrings {
	karakterSiffer: string;
	karakterBokstaver: string;
	karakterbeskrivelse: string;
	kandidatnummer: string;
}

export interface Bunntekst {
	tekstSettesOpp: string;
	tekstSettesNed: string;
	tekstBeholdes: string;
}

export interface Topptekst {
	tekst: string;
}

export interface Karakterbeskrivelse {
	beskrivelse: string;
	bokstaver: string;
}

export interface SendEpostToSensor {
	faggruppeIds: number[];
	subject: string;
	body: string;
}

import { ForeslåttFagpersonKlagenemndsmedlem } from "./ForeslåttFagpersonKlagenemndsmedlem";

export interface FaggruppeWithForeslåtteFagpersonerKlageoppnevning {
	foreslatteFagpersoner: ForeslåttFagpersonKlagenemndsmedlem[];
}

import { Fylke } from "./Fylke";
import { PersonViewModel } from "./PersonViewModel";

export interface ForeslåttFagpersonKlagenemndsmedlem {
	id: string;
	fylker: Fylke[];
	personalia: PersonViewModel;
	sensorerfaring: number;
	status: string;
	svarfrist: string;
	reservert: boolean;
	sensorIFagkoder: string[];
	foreslattIFagkoder: string[];
	andreFaggrupper: string[];
}

export interface Fylke {
	id: number;
	fylkesnummer: string;
	navn: string;
}

import { PersonViewModel } from "./PersonViewModel";

export interface ForeslåttFagpersonViewModel {
	id: string;
	personalia: PersonViewModel;
	tilhorigheter: string[];
	sensorerfaring: number;
	status: string;
	reservert: boolean;
	formoteleder: boolean;
	svarfrist: string;
	foreslattIFagkoderOtherFaggrupper: string[];
	foreslattIFagkoderThisFaggruppe: string[];
	utlåntTil: string;
	utlåntFra: string;
	kanOppnevnesIAndreFaggruppe: boolean;
	eriPublisertSensorpar: boolean;
}

export interface UpdateOppnevningstatusViewModel {
	oppnevningStatus: string;
}

import { FylkesmannViewModel } from "./FylkesmannViewModel";
import { EksamensperiodeViewModel } from "./EksamensperiodeViewModel";

export interface SensorOppnevningssvar {
	fylkesmann: FylkesmannViewModel;
	eksamensperiode: EksamensperiodeViewModel;
}

import { SensurSkoleViewModel } from "./SensurSkoleViewModel";
import { FagkodeInfo } from "./FagkodeInfo";
import { KlagenemndViewModel } from "./KlagenemndViewModel";
import { PersonViewModel } from "./PersonViewModel";

export interface KlageViewModel {
	klageId: number;
	kandidatpameldingId: number;
	klagetidspunkt: string;
	kandidatnummer: string;
	skole: SensurSkoleViewModel;
	fagkode: FagkodeInfo;
	opprinneligKarakter: number;
	lopenummer: number;
	digitalBesvarelse: boolean;
	status: number;
	klagenemnd: KlagenemndViewModel;
	vurderingBekreftet: boolean;
	publisert: boolean;
	kontrollert: boolean;
	begrunnelse: string;
	klagekarakter: number;
	begrunnelseSkrevetAv: PersonViewModel;
	malform: string;
	ekstraVurdertAv: PersonViewModel;
}

import { Skoleadresse } from "./Skoleadresse";

export interface SensurSkoleViewModel {
	navn: string;
	organisasjonsnummer: string;
	mobil: string;
	epost: string;
	besoksadresse: Skoleadresse;
}

import { PersonInfo } from "./PersonInfo";

export interface KlagenemndViewModel {
	id: number;
	lopenummer: number;
	medlemmer: PersonInfo[];
}

import { PersonInfo } from "./PersonInfo";

export interface KlagenemndsmedlemViewModel {
	id: number;
	person: PersonInfo;
	sensorerfaring: number;
	faggrupper: string[];
	foreslatteFagkoder: string[];
	skoletilhorigheter: string[];
}

import { KlagenemndsmedlemViewModel } from "./KlagenemndsmedlemViewModel";
import { KlagenemndViewModel } from "./KlagenemndViewModel";

export interface KlagenemndsmedlemmersoversiktForFylkesmannViewModel {
	klagenemndsmedlemmer: KlagenemndsmedlemViewModel[];
	klagenemnder: KlagenemndViewModel[];
}

export interface KlagepapirbunkeViewModel {
	klageIder: number[];
	lopenummer: number;
}

export interface KlageutdelingKonfliktViewModel {
	papirbunkeLopenummer: number;
	antallKlager: number;
	konflikter: any;
}

export interface VurderingViewModel {
	skrevetAv: string;
	begrunnelse: string;
	karakter: number;
}

import { KlageForKlagenemndsmedlemViewModel } from "./KlageForKlagenemndsmedlemViewModel";

export interface KlageoversiktForKlagenemndsmedlemViewModel {
	oppnevntIFagkoder: string[];
	klager: KlageForKlagenemndsmedlemViewModel[];
}

import { PersonViewModel } from "./PersonViewModel";

export interface KlageForKlagenemndsmedlemViewModel {
	klageId: number;
	opprinneligKarakter: number;
	kandidatpameldingId: number;
	plagiatkontrollBestilt: boolean;
	kandidatnummer: string;
	erDigitalBesvarelse: boolean;
	malform: string;
	fagkode: string;
	klagekarakter: number;
	begrunnelse: string;
	begrunnelseSkrevetAv: string;
	vurderingBekreftet: boolean;
	medklagenemndsmedlemmer: PersonViewModel[];
	klagenemndsmedlemmer: PersonViewModel[];
	ekstraVurdertAv: PersonViewModel;
}

export interface LogEntryModel {
	message: string;
	data: any[];
}

import { Eksamensinfo } from "./Eksamensinfo";
import { EksamensperiodeViewModel } from "./EksamensperiodeViewModel";

export interface EksamensplanViewModel {
	id: number;
	oppgaveansvarstype: string;
	opplaeringsniva: string;
	eksamener: Eksamensinfo[];
	eksamensperiode: EksamensperiodeViewModel;
}

import { ForeslåttFagpersonViewModel } from "./ForeslåttFagpersonViewModel";

export interface FaggruppeWithSensurgrunnlagAndForeslåtteFagpersoner {
	foreslatteFagpersoner: ForeslåttFagpersonViewModel[];
	numberOfBesvarelserPerSensor: number;
	numberOfPameldteKandidater: number;
	erSensoroppnevningStartet: boolean;
	erPublisert: boolean;
}

import { PersonViewModel } from "./PersonViewModel";
import { ForvaltningSkoleViewModel } from "./ForvaltningSkoleViewModel";
import { FylkesmannViewModel } from "./FylkesmannViewModel";

export interface ForeslåttFagpersonLedigInAnotherSensurregion {
	id: string;
	personalia: PersonViewModel;
	skole: ForvaltningSkoleViewModel;
	foreslattIFagkoder: string[];
	ansvarligFylkesmann: FylkesmannViewModel;
}

import { SkoleansvarligViewModel } from "./SkoleansvarligViewModel";
import { FylkesmannViewModel } from "./FylkesmannViewModel";
import { Skoleadresse } from "./Skoleadresse";

export interface ForvaltningSkoleViewModel {
	organisasjonsnummer: string;
	navn: string;
	epost: string;
	telefonnummer: string;
	ansvarligSkoleeier: SkoleansvarligViewModel;
	ansvarligFylkesmann: FylkesmannViewModel;
	skoletype: string;
	nsrId: number;
	antallPameldteKandidater: number;
	antallForeslatteFagpersoner: number;
	mobil: string;
	webadresse: string;
	besoksadresse: Skoleadresse;
	midlertidigAdresse: Skoleadresse;
	midlertidigEpost: string;
	postadresse: Skoleadresse;
	fylke: string;
	kommune: string;
	erGrunnskole: boolean;
	erVideregaendeskole: boolean;
}

export interface SkoleansvarligViewModel {
	organisasjonsnummer: string;
	navn: string;
	epost: string;
	telefonnummer: string;
}

export interface SetFormøteleder {
	personId: string;
}

export interface AutomatiskForslagStatus {
	hasSkoletilhorighetskonflikt: boolean;
	newSensorsAdded: boolean;
	addedExtraSensor: boolean;
}

import { Faggruppe } from "./Faggruppe";

export interface OppnevnINyFaggrupperOversiktViewModel {
	muligeFaggrupper: Faggruppe[];
	antallBesvarelser: number;
}

export interface Faggruppe {
	id: number;
	navn: string;
	fagkoder: string[];
}

import { OppnevningsforespørselMail } from "./OppnevningsforespørselMail";

export interface OppnevningsforespørselViewModel {
	id: number;
	faggruppeId: number;
	versjon: number;
	sendt: string;
	svarfrist: number;
	sendSms: boolean;
	tilleggsinformasjon: string;
	mail: OppnevningsforespørselMail;
}

export interface OppnevningsforespørselMail {
	subject: string;
	htmlBody: string;
}

export interface SkoleSenKlageViewModel {
	id: number;
	organisasjonsnummer: string;
	navn: string;
	telefonnummer: string;
	antallPameldteKandidater: number;
	fylke: string;
	kommune: string;
	senKlageApenTil: string;
	eksamenspameldingId: number;
}

import { SensorViewModel } from "./SensorViewModel";

export interface SensorparForFlyttingAvKandidatgruppe {
	id: number;
	sensorgruppeId: number;
	sensor1: SensorViewModel;
	sensor2: SensorViewModel;
	antallBesvarelser: number;
	erLast: boolean;
	harSkolekonflikt: boolean;
}

import { Adresse } from "./Adresse";

export interface SensorViewModel {
	personId: string;
	id: number;
	erfaring: number;
	fornavn: string;
	etternavn: string;
	mobiltelefonnummer: string;
	epostadresse: string;
	skoletilhorighet: string;
	erFormoteleder: boolean;
	kontonummer: string;
	adresse: Adresse;
	navn: string;
	skoletilhorighetTelefon: string;
	sensorgruppe: string;
	antallBesvarelser: number;
}

import { Eksamensperiode } from "./Eksamensperiode";
import { Eksamensplan } from "./Eksamensplan";
import { Eksamen } from "./Eksamen";
import { Skole } from "./Skole";
import { Kandidatpåmelding } from "./Kandidatpåmelding";
import { Kandidatgruppeansvarlig } from "./Kandidatgruppeansvarlig";
import { Sensorpar } from "./Sensorpar";

export interface Kandidatgruppe {
	id: number;
	eksamenspåmeldingId: number;
	eksamensperiode: Eksamensperiode;
	eksamensplan: Eksamensplan;
	eksamen: Eksamen;
	sensorparId: number;
	skole: Skole;
	numberOfKandidatpåmeldinger: number;
	navn: string;
	kandidatpåmeldinger: Kandidatpåmelding[];
	ansvarlige: Kandidatgruppeansvarlig[];
	publisertSensorpar: Sensorpar;
}

import { Eksamensperiode } from "./Eksamensperiode";
import { Opplæringsnivå } from "./Opplæringsnivå";
import { Ansvarstype } from "./Ansvarstype";
import { Eksamen } from "./Eksamen";

export interface Eksamensplan {
	id: number;
	eksamensperiode: Eksamensperiode;
	opplæringsnivå: Opplæringsnivå;
	oppgaveansvarstype: Ansvarstype;
	eksamener: Eksamen[];
}

import { Eksamensplan } from "./Eksamensplan";
import { Fagkode } from "./Fagkode";
import { Eksamensdel } from "./Eksamensdel";

export interface Eksamen {
	id: number;
	eksamensplan: Eksamensplan;
	tilgjengeligForElever: boolean;
	tilgjengeligForPrivatister: boolean;
	fagkode: Fagkode;
	eksamensdeler: Eksamensdel[];
	variant: string;
	eksamensnummer: string;
	eksamensstartTidspunktUtc: string;
	isAnyEksamensdelerElektronisk: boolean;
	eksamenssluttTidspunktUtc: string;
	isFinished: boolean;
}

import { Språk } from "./Språk";
import { Skoleansvarlig } from "./Skoleansvarlig";
import { Fylkesmann } from "./Fylkesmann";
import { Kommune } from "./Kommune";

export interface Skole {
	nsrId: number;
	erPrivatSkole: boolean;
	erAktiv: boolean;
	språk: Språk;
	opprettetUtc: string;
	endretUtc: string;
	skoleansvarlig: Skoleansvarlig;
	ansvarligFylkesmann: Fylkesmann;
	karakteristikk: string;
	erGrunnskole: boolean;
	erVideregåendeskole: boolean;
	webadresse: string;
	telefon: string;
	mobil: string;
	erAktivTilstandLåst: boolean;
	erSkoletyperLåst: boolean;
	fullname: string;
	id: number;
	navn: string;
	kommune: Kommune;
	organisasjonsnummer: string;
}

import { Kandidatgruppe } from "./Kandidatgruppe";
import { KandidatWithKandidatnummer } from "./KandidatWithKandidatnummer";
import { Kandidattype } from "./Kandidattype";
import { Kandidatdeltakelsesstatus } from "./Kandidatdeltakelsesstatus";
import { Karakter } from "./Karakter";

export interface Kandidatpåmelding {
	id: number;
	kandidatgruppe: Kandidatgruppe;
	eksamensId: number;
	skoleId: number;
	digitalBesvarelse: boolean;
	plagiatkontrollBestilt: boolean;
	kandidatWithKandidatnummer: KandidatWithKandidatnummer;
	kandidattype: Kandidattype;
	kandidatdeltakelsesstatus: Kandidatdeltakelsesstatus;
	passord: string;
	passordGenerertUtc: string;
	passordVersion: number;
	passordKeyReference: string;
	karakter: Karakter;
	besvarelsesnummer: number;
	hasBekreftetEndeligKarakter: boolean;
	hasDeltatt: boolean;
}

import { Person } from "./Person";

export interface Kandidatgruppeansvarlig {
	kandidatgruppeId: number;
	person: Person;
}

import { Sensor } from "./Sensor";
import { FaggruppeSensuransvar } from "./FaggruppeSensuransvar";
import { Kandidatgruppe } from "./Kandidatgruppe";

export interface Sensorpar {
	id: number;
	sensorgruppeId: number;
	førsteSensor: Sensor;
	andreSensor: Sensor;
	faggruppeSensuransvar: FaggruppeSensuransvar;
	kandidatgrupper: Kandidatgruppe[];
	fellessensurÅpen: boolean;
}

export interface Opplæringsnivå {
	beskrivelse: string;
}

export interface Ansvarstype {

}

import { TekstOversettelse } from "./TekstOversettelse";
import { Ansvarstype } from "./Ansvarstype";
import { FagkodeKandidattype } from "./FagkodeKandidattype";
import { Opplæringsnivå } from "./Opplæringsnivå";
import { Semester } from "./Semester";

export interface Fagkode {
	id: number;
	kode: string;
	erAktiv: boolean;
	navn: TekstOversettelse[];
	oppgaveansvarstype: Ansvarstype;
	sensuransvarstype: Ansvarstype;
	kandidattyper: FagkodeKandidattype[];
	sistEndretEksternUtc: string;
	opplaeringsnivaa: Opplæringsnivå;
	startSemester: Semester;
	startÅr: number;
	stoppSemester: Semester;
	stoppÅr: number;
	erManuell: boolean;
	harPlagiatkontroll: boolean;
}

import { Eksamen } from "./Eksamen";
import { Eksamensdeltype } from "./Eksamensdeltype";
import { Eksamensmateriell } from "./Eksamensmateriell";

export interface Eksamensdel {
	id: number;
	eksamen: Eksamen;
	ingenElektroniskPålogging: boolean;
	fraTidspunktUtc: string;
	tilTidspunktUtc: string;
	materiellTilgjengeligTidspunktUtc: string;
	duration: number;
	eksamensdeltype: Eksamensdeltype;
	eksamensmateriell: Eksamensmateriell[];
}

import { Fylke } from "./Fylke";
import { Kommune } from "./Kommune";
import { Språk } from "./Språk";

export interface Skoleansvarlig {
	ansvarligFylke: Fylke;
	ansvarligKommune: Kommune;
	erAktiv: boolean;
	språk: Språk;
	opprettetUtc: string;
	endretUtc: string;
	epost: string;
	telefon: string;
	fullname: string;
	id: number;
	navn: string;
	kommune: Kommune;
	organisasjonsnummer: string;
}

import { Språk } from "./Språk";
import { ForvaltningsenhetAdresse } from "./ForvaltningsenhetAdresse";
import { Kommune } from "./Kommune";

export interface Fylkesmann {
	erAktiv: boolean;
	språk: Språk;
	opprettetUtc: string;
	endretUtc: string;
	postadresse: ForvaltningsenhetAdresse;
	besøksadresse: ForvaltningsenhetAdresse;
	firmakode: string;
	koststed: string;
	epost: string;
	telefon: string;
	fullname: string;
	id: number;
	navn: string;
	kommune: Kommune;
	organisasjonsnummer: string;
}

import { Fylke } from "./Fylke";

export interface Kommune {
	kommuneId: number;
	kommunenummer: string;
	navn: string;
	fylke: Fylke;
}

import { Kandidat } from "./Kandidat";
import { Språk } from "./Språk";

export interface KandidatWithKandidatnummer {
	id: number;
	eksamensperiodeId: number;
	kandidatnummer: string;
	kandidat: Kandidat;
	målform: Språk;
}

export interface Kandidatdeltakelsesstatus {
	beskrivelse: string;
}

export interface Karakter {
	id: number;
	kandidatpåmeldingId: number;
	karakterforslagFørstesensor: number;
	karakterforslagAndresensor: number;
	endeligKarakter: number;
	manglerBesvarelseFørstesensor: boolean;
	manglerBesvarelseAndresensor: boolean;
	endeligManglerBesvarelse: boolean;
	bekreftet: boolean;
}

import { Språk } from "./Språk";

export interface Person {
	id: string;
	fødselsnummer: string;
	fødselsdato: string;
	fornavn: string;
	etternavn: string;
	gateadresse: string;
	postnummer: string;
	poststed: string;
	land: string;
	telefonnummerPrivat: string;
	telefonnummerArbeid: string;
	mobiltelefonnummer: string;
	epostadresse: string;
	personaliaBekreftet: boolean;
	språk: Språk;
	kontonummer: string;
	navn: string;
}

import { Oppnevningstatus } from "./Oppnevningstatus";
import { Person } from "./Person";
import { Skole } from "./Skole";
import { Tilhørighet } from "./Tilhørighet";
import { Sensurhistorikk } from "./Sensurhistorikk";
import { Oppnevningsforespørsel } from "./Oppnevningsforespørsel";
import { FaggruppeSensuransvar } from "./FaggruppeSensuransvar";

export interface Sensor {
	id: number;
	eksamensperiodeId: number;
	sensorgruppeId: number;
	andreSensorgruppeId: number;
	status: Oppnevningstatus;
	person: Person;
	harPrioritet: boolean;
	erFormøteLeder: boolean;
	skoletilhørigheter: Skole[];
	tilhørigheter: Tilhørighet[];
	sensurhistorikk: Sensurhistorikk[];
	oppnevningsforespørsel: Oppnevningsforespørsel;
	token: string;
	svarfristUtc: string;
	faggruppe: FaggruppeSensuransvar;
	andreFaggruppe: FaggruppeSensuransvar;
	antallBesvarelser: number;
	antallGangerSomSensor: number;
}

import { FagkodeSensuransvar } from "./FagkodeSensuransvar";
import { Eksamensperiode } from "./Eksamensperiode";
import { Opplæringsnivå } from "./Opplæringsnivå";

export interface FaggruppeSensuransvar {
	id: number;
	navn: string;
	fagkoder: FagkodeSensuransvar[];
	erSisteVersjonPublisert: boolean;
	erPublisert: boolean;
	fellessensurÅpen: boolean;
	eksamensperiode: Eksamensperiode;
	opplæringsnivå: Opplæringsnivå;
	faggruppenavn: string;
}

import { Språk } from "./Språk";

export interface TekstOversettelse {
	tekst: string;
	språkForkortelse: Språk;
}

import { Kandidattype } from "./Kandidattype";

export interface FagkodeKandidattype {
	fagkodeId: number;
	kandidattype: Kandidattype;
	eksamensfag: string;
	eksamensordning: string;
	eksamensform: string;
}

import { Eksamensdel } from "./Eksamensdel";
import { Språk } from "./Språk";
import { Eksamensmaterielltype } from "./Eksamensmaterielltype";

export interface Eksamensmateriell {
	id: number;
	eksamensdel: Eksamensdel;
	språk: Språk;
	løpenummer: number;
	eksamensmaterielltype: Eksamensmaterielltype;
	pgsaFilename: string;
	orginaltFilnavn: string;
}

export interface ForvaltningsenhetAdresse {
	adresse: string;
	postnummer: string;
	poststed: string;
	land: string;
}

import { Språk } from "./Språk";

export interface Kandidat {
	id: string;
	fødselsnummer: string;
	fødselsdato: string;
	fornavn: string;
	etternavn: string;
	målform: Språk;
}

export interface Oppnevningstatus {
	beskrivelse: string;
}

import { Tilhørighetstype } from "./Tilhørighetstype";

export interface Tilhørighet {
	personId: string;
	enhetsId: number;
	type: Tilhørighetstype;
	navn: string;
	organisasjonsnummer: string;
	beskrivelse: string;
}

import { Person } from "./Person";
import { Semester } from "./Semester";
import { Fagkode } from "./Fagkode";

export interface Sensurhistorikk {
	id: number;
	person: Person;
	semester: Semester;
	fagkode: Fagkode;
	skoleår: number;
}

import { FaggruppeSensuransvar } from "./FaggruppeSensuransvar";

export interface Oppnevningsforespørsel {
	id: number;
	versjon: number;
	sendtUtc: string;
	svarfrist: number;
	sendSms: boolean;
	tilleggsinformasjon: string;
	faggruppe: FaggruppeSensuransvar;
}

import { Fylkesmann } from "./Fylkesmann";
import { Fagkode } from "./Fagkode";
import { Sensurregion } from "./Sensurregion";

export interface FagkodeSensuransvar {
	id: number;
	fylkesmann: Fylkesmann;
	fagkode: Fagkode;
	sensurregioner: Sensurregion[];
	karakterPublisert: boolean;
}

import { Opplæringsnivå } from "./Opplæringsnivå";
import { Fylke } from "./Fylke";

export interface Sensurregion {
	id: number;
	eksamensperiodeId: number;
	identifikator: string;
	opplæringsnivå: Opplæringsnivå;
	fylker: Fylke[];
}

import { SensorgruppeViewModel } from "./SensorgruppeViewModel";
import { SensorViewModel } from "./SensorViewModel";
import { SensorparViewModel } from "./SensorparViewModel";

export interface FaggruppeMedSensorgrupper {
	id: number;
	sensorgrupper: SensorgruppeViewModel[];
	formoteleder: string;
	antallBesvarelserPerSensor: number;
	antallGrupperteSensorer: number;
	antallOppnevnteSensorer: number;
	kandidaterPameldt: number;
	maksAntallBesvarelserPerSensor: number;
	pameldingOver: boolean;
	erSisteVersjonPublisert: boolean;
	erPublisert: boolean;
	sensorerUtenGruppe: SensorViewModel[];
	sensorparUtenGruppe: SensorparViewModel[];
}

import { SensorparViewModel } from "./SensorparViewModel";

export interface SensorgruppeViewModel {
	id: number;
	sensorpar: SensorparViewModel[];
	erLast: boolean;
	antallSensorer: number;
	antallBesvarelser: number;
}

import { SensorViewModel } from "./SensorViewModel";

export interface SensorparViewModel {
	id: number;
	sensor1: SensorViewModel;
	sensor2: SensorViewModel;
	antallBesvarelser: number;
}

export interface ByttSensor {
	sensorSourceId: number;
	sensorTargetId: number;
}

export interface FlyttSensorViewModel {
	sensorId: number;
	sensorparIdAsForstesensor: number;
	sensorparIdAsAndresensor: number;
}

import { SensorViewModel } from "./SensorViewModel";

export interface KandidatgruppeMedSensorer {
	navn: string;
	id: number;
	skole: string;
	besvarelser: number;
	sensorparId: number;
	sensor1: SensorViewModel;
	sensor2: SensorViewModel;
	eriLastSensorgruppe: boolean;
}

export interface ErstattSensorViewModel {
	erstattForstesensor: boolean;
	sensorTargetId: number;
	kandidatgruppeId: number;
}

import { PersonViewModel } from "./PersonViewModel";
import { FylkesmannViewModel } from "./FylkesmannViewModel";
import { HonorarpostViewModel } from "./HonorarpostViewModel";
import { PersonInfo } from "./PersonInfo";
import { HonorarregningFilViewModel } from "./HonorarregningFilViewModel";

export interface HonorarregningSensurViewModel {
	sensorId: number;
	id: number;
	faggruppenavn: string;
	ansvarsomrade: string;
	eksamensperiode: string;
	erLevert: boolean;
	status: number;
	alleKaraktererBekreftet: boolean;
	totalt: number;
	personalia: PersonViewModel;
	fylkesmann: FylkesmannViewModel;
	honorarposter: HonorarpostViewModel[];
	attestertAv: PersonInfo;
	budsjettdisponertAv: PersonInfo;
	levertAv: PersonInfo;
	fil: HonorarregningFilViewModel;
}

import { BesvarelseForFylkesmannViewModel } from "./BesvarelseForFylkesmannViewModel";

export interface BesvarelsesoversiktForFylkesmannViewModel {
	besvarelser: BesvarelseForFylkesmannViewModel[];
}

import { KarakterViewModel } from "./KarakterViewModel";
import { PersonViewModel } from "./PersonViewModel";
import { SensurSkoleViewModel } from "./SensurSkoleViewModel";

export interface BesvarelseForFylkesmannViewModel {
	kandidatpameldingId: number;
	karakter: KarakterViewModel;
	kandidatnummer: string;
	fagkode: string;
	kandidatgruppe: string;
	sensor1: PersonViewModel;
	sensor2: PersonViewModel;
	skole: SensurSkoleViewModel;
	erDigital: boolean;
	plagiatkontrollBestilt: boolean;
	shouldShowBesvarelsetype: boolean;
}

export interface KarakterViewModel {
	kandidatpåmeldingId: number;
	karakterforslagFørstesensor: number;
	karakterforslagAndresensor: number;
	endeligKarakter: number;
	manglerBesvarelseFørstesensor: boolean;
	manglerBesvarelseAndresensor: boolean;
	endeligManglerBesvarelse: boolean;
	bekreftet: boolean;
}

import { SensorparWithProgresjonViewModel } from "./SensorparWithProgresjonViewModel";

export interface SensorprogresjonForFylkesmannViewModel {
	sensorpar: SensorparWithProgresjonViewModel[];
}

import { SensorWithProgresjonViewModel } from "./SensorWithProgresjonViewModel";

export interface SensorparWithProgresjonViewModel {
	id: number;
	antallBesvarelser: number;
	antallEndeligKarakter: number;
	sensor1: SensorWithProgresjonViewModel;
	sensor2: SensorWithProgresjonViewModel;
	sensorgruppenavn: string;
}

import { PersonViewModel } from "./PersonViewModel";

export interface SensorWithProgresjonViewModel {
	id: number;
	person: PersonViewModel;
	antallKarakterforslag: number;
	antallBesvarelser: number;
}

import { FagkodeSensuransvarViewModel } from "./FagkodeSensuransvarViewModel";

export interface FaggruppeWithSensuransvar {
	id: number;
	isUserCreated: boolean;
	oppnevningStarted: boolean;
	endeligKarakterApen: boolean;
	faggruppeNavn: string;
	erPublisert: boolean;
	fagkoder: FagkodeSensuransvarViewModel[];
}

import { FagkodeInfo } from "./FagkodeInfo";

export interface FagkodeSensuransvarViewModel {
	id: number;
	fagkode: FagkodeInfo;
	regioner: string[];
	karakterPublisert: boolean;
}

export interface PubliserKarakterViewModel {
	id: number;
	karakterPublisert: boolean;
}

import { SimpleSkole } from "./SimpleSkole";
import { EksamensperiodeViewModel } from "./EksamensperiodeViewModel";

export interface SkoleoversiktViewModel {
	skoler: SimpleSkole[];
	eksamensperiode: EksamensperiodeViewModel;
}

export interface SimpleSkole {
	navn: string;
	organisasjonsnummer: string;
	antallForeslatteFagpersonerSentral: number;
	antallForeslatteFagpersonerLokal: number;
	skoletype: string;
	kommune: string;
	ansvarligSkoleeier: string;
	ansvarligFylkesmann: string;
	antallPameldteKandidaterSentralSentral: number;
	antallPameldteKandidaterSentralLokal: number;
	antallPameldteKandidaterLokalLokal: number;
}

export interface SkoleMidlertidigEpostViewModel {
	epost: string;
}

export interface Utdanningsdirektoratet {
	organisasjonsnummer: string;
	navn: string;
	epost: string;
	telefonnummer: string;
}