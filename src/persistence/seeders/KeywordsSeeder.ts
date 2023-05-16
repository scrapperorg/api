import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { KeywordSchema } from "../Keyword";

export const keywords = [
  "achizitor",
  "achizitor public",
  "achiziție centralizată",
  "achiziție directă",
  "achiziție publică",
  "achiziție sectorială",
  "achiziții centralizate",
  "achiziții publice",
  "achiziții sectoriale",
  "achiziționează direct",
  "acord cadru",
  "acord de asociere",
  "act adițional",
  "activități de achiziție auxiliare",
  "activități relevante",
  "actualiza",
  "actualizare",
  "aeroporturi",
  "ajustare",
  "alegerea procedurii de achiziții",
  "alegerea procedurii de atribuire",
  "ANAP",
  "angajament ferm",
  "angajare expertiză externă",
  "ANRMAP",
  "antrerpiza",
  "anulare procedurii de atribuire",
  "anularea procedurii de atribuire",
  "anunț de atribuire",
  "anunț de concesiune",
  "anunț de intenție valabil în mod continuu",
  "anunț de participare",
  "anunț orientativ periodic",
  "anunț privind existența unui sistem dinamic de ofertare",
  "aplicarea procedurii",
  "aplică procedura",
  "apărare",
  "are dreptul de a utiliza",
  "atribuie",
  "atribuire",
  "atribuire directă",
  "atribuit",
  "autoritate contractantă",
  "autorități contractante",
  "beneficiar",
  "brevete",
  "caiet de sarcini",
  "calificare",
  "candidatura",
  "candidați",
  "candidați",
  "capacitate de exercitare a activității profesionale",
  "capacitate profesională",
  "capacitate tehnică",
  "catalog electronic",
  "cerințe de natură tehnică",
  "cerințe tehnice",
  "cerință",
  "cesionează",
  "cesiune",
  "cesiune de contract de achiziție",
  "clauze contractuale",
  "CNSC",
  "cofinanțare",
  "cofinanțate",
  "colaborează cu",
  "comisie",
  "comisie de evaluare",
  "comisie de licitatiee",
  "compensare lucrări",
  "concedent",
  "concesiona",
  "concesionar",
  "concesiune",
  "concesiune de lucrări publice",
  "concesiune de servicii publice",
  "concurs de soluții",
  "condiții contractuale",
  "confidențial",
  "confidențialitate",
  "conflict de interese",
  "consultarea pieței",
  "contestarea documentației de atribuire",
  "contestarea rezultatului procedurii de achiziții",
  "contestație",
  "contestație formulată pe cale judiciară",
  "contestație pe cale administrativ jurisdicțională",
  "contract",
  "contract atribuit unei întreprinderi afiliate",
  "contract de achiziție sectorială",
  "contract de concesiune de lucrări",
  "contract de concesiune de servicii",
  "contract de execuție lucrări",
  "contract de furnizare",
  "contract de lucrări",
  "contract de servicii",
  "contract rezervat",
  "contract sectorial",
  "contract subsecvent",
  "contract în domeniul apărării naționale",
  "contract încheiat între entități contractante",
  "contractare",
  "contractare evaluatori",
  "contractare expertiză externă",
  "contractare experți externi",
  "contracte",
  "contractor",
  "control ex-ante achiziție",
  "control procedura achiziție",
  "costul",
  "costul cel mai scăzut",
  "CPV",
  "criterii",
  "criterii de calificare și selecție",
  "criteriu",
  "criteriu de atribuire",
  "criteriu de calificare și selecție",
  "cumparere",
  "cumpărare directă",
  "cumpărare servicii de evaluare",
  "cumpără",
  "delegare de gestiune",
  "delegare directă",
  "denatura concurență",
  "departajare",
  "derogare",
  "derula",
  "desfășurarea procedurii de achiziții",
  "determinarea valorii estimate a contractului",
  "directivele europene în domeniul achizițiilor publice",
  "divizare contractului de achiziție",
  "divizarea contractului de achiziție",
  "divizează contractului de achiziție",
  "document constatator",
  "document descriptiv",
  "document justificativ",
  "documentația de atribuire",
  "dosarul achiziției",
  "dotare",
  "drept exclusiv",
  "drept special",
  "dreptul ofertantului",
  "drepturile și obligațiile ofertantului",
  "DUAE",
  "E-Certis",
  "efectuarea",
  "energie electrică",
  "energie termică",
  "entitate contractantă",
  "erata",
  "estimare",
  "estimarea valorii contractului de achiziție",
  "evaluare",
  "evaluează",
  "evenimente imprevizibile",
  "ex-ante",
  "ex-post",
  "exceptări",
  "excepție",
  "exclude din procedură",
  "excludere din procedură",
  "execuție",
  "experiență similară",
  "experți",
  "factor",
  "factori de evaluare",
  "FIDIC",
  "finanțare",
  "fișa de date a achiziției",
  "fonduri",
  "furnizor",
  "furnizor servicii de achiziție",
  "garanție de bună execuție",
  "garanție de participare",
  "gaze",
  "gestiune delegată",
  "gestiune directă",
  "implementare",
  "incidența legislației în domeniul achizițiilor",
  "iniția procedura de achiziție",
  "inițiere procedură de achiziție",
  "Instrucțiune ANAP",
  "Instrucțiune ANRMAP",
  "instrucțiuni ANAP",
  "instrucțiuni ANRMAP",
  "instrucțiuni către",
  "instrucțiuni către ofertanți",
  "interes public",
  "invitație de participare",
  "invitație la licitație",
  "invitație la procedură",
  "JOUE",
  "Jurnalul Oficial al Uniunii Europene",
  "lansare procedură de achiziții",
  "Legea nr. 101/2016",
  "Legea nr.100/2016 – HG nr. 867/2016",
  "Legea nr.98/2016 – HG nr. 395/2016",
  "Legea nr.99/2016 – HG nr.394/2016",
  "legislația europeană în domeniul achizițiilor publice",
  "legislația în domeniul achizițiilor publice",
  "legislația în materia achizițiilor publice",
  "legislația în materia achizițiilor publice",
  "legislației în domeniul achizițiilor publice",
  "licitația deschisă",
  "licitație",
  "licitație electronică",
  "livrare",
  "lotizare",
  "lucrări",
  "lucrări suplimentare",
  "membrii comisiei de evaluare",
  "modalitate de achiziție",
  "modalitate de acordare",
  "modalitate de atribuire",
  "modificare contractului",
  "modificarea caietului de sarcini",
  "modificarea contractului",
  "modificarea criteriilor de atribuire",
  "modificarea criteriilor de calificare",
  "modificarea criteriilor de selecție",
  "modificarea ofertei",
  "modificarea soluției tehnice",
  "modificări contractului",
  "motiv de excludere",
  "motive de excludere",
  "măsuri de remediere",
  "măsuri de remedire",
  "nediscriminare",
  "negociere contractului de achiziție",
  "negocierea competitivă",
  "negocierea contractului de achiziție",
  "negocierea fără invitație prealabilă la procedura concurențială de ofertare",
  "negocierea fără publicare prealabilă",
  "nepublicarea documentației de atribuire",
  "nepublicarea unui anunț",
  "nominalizare",
  "norme interne",
  "norme metodologice",
  "note de comandă suplimentară",
  "note de renunțare",
  "notificare prelabilă",
  "notă justificativă",
  "O.U.G. nr. 34/2006 – H.G. nr. 925/2006",
  "obiect de investiție",
  "obiectiv de investiție",
  "obiectul contractului",
  "obligația ofertantului",
  "obținerea documentației de atribuire",
  "oferta",
  "ofertant",
  "operator economic",
  "origine",
  "OUG nr. 114/2011",
  "PAAP",
  "parteneriat",
  "parteneriat public-privat",
  "petrol",
  "planificare",
  "planificarea achiziției",
  "porturi",
  "pregătirea achiziției",
  "prejudicii",
  "prejudiciu",
  "prelungire contractuală",
  "prelungirea termenelor",
  "prestare",
  "prestații",
  "prevederi legale",
  "preț neobișnuit de scăzut",
  "prețul",
  "prețul cel mai scăzut",
  "prin derogare de la",
  "prin excepție de la",
  "procedeu",
  "procedură",
  "procedură de achiziție",
  "procedură de atribuire",
  "procedură proprieprocedura specială",
  "procedură simplificată",
  "procedură în domeniul apărării",
  "proces de atribuire",
  "produse",
  "programe naționale",
  "programul anual al achizițiilor publice",
  "programul anual al achizițiilor sectoriale",
  "proiect",
  "proiect de investiții",
  "proiect major de investiții",
  "proiectare",
  "propunere financiară",
  "propunere tehnică",
  "publicarea documentației de atribuire",
  "publicarea unui anunț",
  "punctaj",
  "punerea la dispoziție a documentației de atribuire",
  "raport calitate-cost",
  "raport calitate-preț",
  "raportul procedurii",
  "realizarea achiziției",
  "realizarea achiziției publice",
  "redevență",
  "reducerea termenelor",
  "restrângere artificială a concurenței",
  "restrânsaprocedură de licitații",
  "revizuire",
  "rezilia",
  "reziliere",
  "rezultatul procedurii",
  "risc de operare",
  "SEAP",
  "SEAP",
  "securitate",
  "selectează",
  "selecție",
  "servicii",
  "servicii auxiliare",
  "servicii comunitare de utilități publice",
  "servicii de evaluare",
  "servicii de utilitate publică",
  "servicii poștale",
  "servicii publice",
  "servicii sociale",
  "Serviciu de utilitate publică",
  "serviciu public",
  "similar",
  "sistem de ofertare",
  "sistemul electronic de achiziții publice",
  "situație de conflict de interese",
  "situație potențial generatoare de conflict de interese",
  "specificație",
  "specificații tehnice",
  "standarde naționale",
  "strategia anuală de achiziție publică",
  "strategie de contractare",
  "studiu de fezabilitate",
  "studiu de fundamentare",
  "subcontractant",
  "subcontractare",
  "subcriteriu de atribuire",
  "suplimentare",
  "suspendarea procedurii",
  "susținerea unui terț",
  "tehnic",
  "tehnice",
  "termen",
  "termen-limită de depunere a ofertelor",
  "terț susținător",
  "transparență",
  "transport",
  "tratament egal",
  "unitate centralizată",
  "unități centralizate",
  "unor terți",
  "va efectua",
  "valoare achiziție",
  "valoare estimată",
  "verificare ex-achiziție",
  "verificare post-achiziție",
  "împărțirea contractului de achiziție",
  "în colaborare cu experți externi",
  "în condițiile legii",
  "încheia",
  "încheie direct",
  "întreprindere publică",
];

export class KeywordsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {

    keywords.forEach((keyword) => {
      em.create(KeywordSchema, { name: keyword });
    });
  }
}
