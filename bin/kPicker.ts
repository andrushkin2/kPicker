const daysInMonth = (date: Date): number => 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();

interface IDateParameters {
    d: (date: Date) => string;
    dd: (date: Date) => string;
    ddd: (date: Date) => string;
    dddd: (date: Date) => string;
    M: (date: Date) => string;
    MM: (date: Date) => string;
    MMM: (date: Date) => string;
    MMMM: (date: Date) => string;
    y: (date: Date) => string;
    yy: (date: Date) => string;
    yyyy: (date: Date) => string;
    h: (date: Date) => string;
    hh: (date: Date) => string;
    H: (date: Date) => string;
    HH: (date: Date) => string;
    m: (date: Date) => string;
    mm: (date: Date) => string;
    s: (date: Date) => string;
    ss: (date: Date) => string;
    l: (date: Date) => string;
    L: (date: Date) => string;
    t: (date: Date) => string;
    tt: (date: Date) => string;
    T: (date: Date) => string;
    TT: (date: Date) => string;
}

class DateParser {
    private expression: RegExp = /d{1,4}|M{1,4}|yy(?:yy)?|y|([HhmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
    private shortDaysNames: string[];
    private daysName: string[];
    private shortMonthsNames: string[];
    private monthsNames: string[];
    private dateParameters: IDateParameters;
    constructor(shortDaysNames: string[], daysName: string[], shortMonthsNames: string[], monthsNames: string[]) {
        this.shortDaysNames = shortDaysNames;
        this.daysName = daysName;
        this.shortMonthsNames = shortMonthsNames;
        this.monthsNames = monthsNames;
        this.dateParameters = this.getDateParameters();
    }
    private addPadding(value: number | string, resultLength: number = 2): string {
        let val: string = value.toString();
        while (val.length < resultLength) {
            val = `0${val}`;
        }
        return val;
    }
    private getDateParameters(): IDateParameters {
        return {
            d: (date: Date): string => `${date.getDate()}`,
            dd: (date: Date): string => this.addPadding(date.getDate()),
            ddd: (date: Date): string => this.shortDaysNames[date.getDay()],
            dddd: (date: Date): string => this.daysName[date.getDay()],
            M: (date: Date): string => `${date.getMonth() + 1}`,
            MM: (date: Date): string => this.addPadding(date.getMonth() + 1),
            MMM: (date: Date): string => this.shortMonthsNames[date.getMonth()],
            MMMM: (date: Date): string => this.monthsNames[date.getMonth()],
            y: (date: Date): string => `${parseInt(date.getFullYear().toString().slice(2))}`,
            yy: (date: Date): string => date.getFullYear().toString().slice(2),
            yyyy: (date: Date): string => date.getFullYear().toString(),
            h: (date: Date): string => `${date.getHours() % 12 || 12}`,
            hh: (date: Date): string => this.addPadding(date.getHours() % 12 || 12),
            H: (date: Date): string => `${date.getHours()}`,
            HH: (date: Date): string => this.addPadding(date.getHours()),
            m: (date: Date): string => `${date.getMinutes()}`,
            mm: (date: Date): string => this.addPadding(date.getMinutes()),
            s: (date: Date): string => `${date.getSeconds()}`,
            ss: (date: Date): string => this.addPadding(date.getSeconds()),
            l: (date: Date): string => this.addPadding(date.getMilliseconds(), 3),
            L: (date: Date): string => {
                let mill: number = date.getMilliseconds();
                return `${mill > 99 ? Math.round(mill / 10) : mill}`;
            },
            t: (date: Date): string => date.getHours() < 12 ? "a" : "p",
            tt: (date: Date): string => date.getHours() < 12 ? "am" : "pm",
            T: (date: Date): string => date.getHours() < 12 ? "A" : "P",
            TT: (date: Date): string => date.getHours() < 12 ? "AM" : "PM"
        };
    }
    public dateToString(date: Date, dateFormat: string, shortDaysNames: string[], daysName: string[], shortMonthsNames: string, monthsNames: string[]): string | undefined {
        let getNextChar = (charValue: string): string => {
                let parameter: ((date: Date) => string) | undefined = this.dateParameters[charValue];
                return parameter ? parameter(date) : charValue.slice(1, charValue.length - 1);
            };
        return dateFormat.replace(this.expression, getNextChar);
    }
}