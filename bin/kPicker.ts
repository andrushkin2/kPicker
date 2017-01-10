let daysInMonth = (date: Date): number => 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();

class DateParser {
    private expression: RegExp = /d{1,4}|M{1,4}|yy(?:yy)?|y|([HhmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
    private addPadding(value: number | string, resultLength: number = 2): string {
        let val: string = value.toString();
        while (val.length < resultLength) {
            val = `0${val}`;
        }
        return val;
    }
    private getDateParameters(date: Date, shortDaysNames: string[], daysName: string[], shortMonthsNames: string, monthsNames: string[]) {
        return {
            d: (): string => `${date.getDate()}`,
            dd: (): string => this.addPadding(date.getDate()),
            ddd: (): string => shortDaysNames[date.getDay()],
            dddd: (): string => daysName[date.getDay()],
            M: (): string => `${date.getMonth() + 1}`,
            MM: (): string => this.addPadding(date.getMonth() + 1),
            MMM: (): string => shortMonthsNames[date.getMonth()],
            MMMM: (): string => monthsNames[date.getMonth()],
            y: (): string => `${parseInt(date.getFullYear().toString().slice(2))}`,
            yy: (): string => date.getFullYear().toString().slice(2),
            yyyy: (): string => date.getFullYear().toString(),
            h: (): string => `${date.getHours() % 12 || 12}`,
            hh: (): string => this.addPadding(date.getHours() % 12 || 12),
            H: (): string => `${date.getHours()}`,
            HH: (): string => this.addPadding(date.getHours()),
            m: (): string => `${date.getMinutes()}`,
            mm: (): string => this.addPadding(date.getMinutes()),
            s: (): string => `${date.getSeconds()}`,
            ss: (): string => this.addPadding(date.getSeconds()),
            l: (): string => this.addPadding(date.getMilliseconds(), 3),
            L: (): string => {
                let mill: number = date.getMilliseconds();
                return `${mill > 99 ? Math.round(mill / 10) : mill}`;
            },
            t: (): string => date.getHours() < 12 ? "a" : "p",
            tt: (): string => date.getHours() < 12 ? "am" : "pm",
            T: (): string => date.getHours() < 12 ? "A" : "P",
            TT: (): string => date.getHours() < 12 ? "AM" : "PM"
        };
    }
    public dateToString(date: Date, dateFormat: string, shortDaysNames: string[], daysName: string[], shortMonthsNames: string, monthsNames: string[]): string | undefined {
        let dateParameters = this.getDateParameters(date, shortDaysNames, daysName, shortMonthsNames, monthsNames),
            getNextChar = (charValue: string): string => {
                let parameter: (() => string) | undefined = dateParameters[charValue];
                return parameter ? parameter() : charValue.slice(1, charValue.length - 1);
            };
        return dateFormat.replace(this.expression, getNextChar);
    }
}