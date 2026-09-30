/**
 * Facts only the owner can supply (DESIGN-GUIDELINES §1.18). Empty values are deliberate: nothing here is invented.
 *
 * - In production an empty block is omitted from the page, so nothing half-finished ships.
 * - In development it renders as a clearly-marked placeholder so the layout can still be reviewed.
 */
type Owner = {
  founder: {
    name: string;
    role: string;
    /** Path under /public, e.g. "/founder.jpg". A real photo: unstyled, no filters, structure radius (§1.10). */
    photo: string;
    /** Personal Messenger link for the founder band, e.g. https://m.me/… Falls back to Chaster's page. */
    messengerUrl: string;
    /** +995 5XX XX XX XX */
    phone: string;
  };
  company: {
    legalName: string;
    idCode: string;
    address: string;
    /** Also the data-deletion contact (Meta requires a real route, §1.2). Falls back to Messenger when empty. */
    email: string;
    phone: string;
  };
  /** Legal pages are plain-language drafts until a lawyer signs them off (§1.15). */
  legalReviewed: boolean;
};

export const owner: Owner = {
  founder: {
    name: "", // TODO(OWNER) #14
    role: "", // TODO(OWNER) #14
    photo: "",
    messengerUrl: "",
    phone: "",
  },
  company: {
    legalName: "", // TODO(OWNER) #4, e.g. შპს …
    idCode: "", // ს/კ
    address: "",
    email: "",
    phone: "",
  },
  legalReviewed: false,
};

export const founderReady = Boolean(owner.founder.name && owner.founder.role);
export const companyReady = Boolean(owner.company.legalName && owner.company.idCode);
export const isDev = process.env.NODE_ENV !== "production";
