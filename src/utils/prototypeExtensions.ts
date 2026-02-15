declare global {
    interface String {
        /**
         * 如果 condition 成立，返回原值，否则返回 ""
         * @param condition 判断条件
         */
        if(condition: boolean): string;
        /**
         * 如果所有前置 {@link if} 不成立，则进行此函数。如果 condition 成立，返回 value，否则返回 ""
         *
         * 常用于 {@link if} 和 {@link elif} 函数后，且不带有 elseValue 参数
         * @param condition 判断条件
         * @param value condition 成立时的返回值
         * @example
         * "a>1"
         * .if(a>1) // 在 a > 1 时返回 "a>1"
         * .elif(a>2, "a>2") // 在 1 >= a > 2 时返回 "a>2"
         */
        elif(condition: boolean, value: string): string;
        /**
         * 如果所有前置 {@link if} 和 {@link elif} 不成立，返回 value，否则返回前置 if 或 elif 规定的值
         *
         * 常用于 {@link if} 和 {@link elif} 函数后，且该 if 函数仅有 1 个参数
         * @param value 前置条件都不成立时地返回值时的返回值
         * @example
         * "a>1"
         * .if(a>1) // 在 a > 1 时返回 "a>1"
         * .elif(a>2, "a>2") // 在 1 >= a > 2 时返回 "a>2"
         * .else("a>=2") // 否则返回 "a>=2"
         */
        else(value: string): string;

        /**
         * 判断是否是一个字符串
         * @param str 被判断的字符串
         */
        is(str: string): boolean;

        /**
         * 检查字符串是否为空，如果为空则返回一个空字符串。
         * @param str 如果源字符串为空，则替换为 str
         * @return 如果输入字符串为空，则返回 str；否则返回原始字符串。
         */
        emptyThen(str: string): string;
    }
    interface Number {
        /**
         * 判断数值是否相等
         * @param int 被比较的数值
         */
        is(int: number): boolean;
    }
}
String.prototype.if = function (condition: boolean): string {
    if (condition) return this.toString();
    return '';
};
String.prototype.elif = function (
    condition: boolean,
    value: string = '',
): string {
    if (this !== '') return this.toString();
    if (condition) return value;
    return '';
};
String.prototype.else = function (value: string): string {
    if (this !== '') return this.toString();
    return value;
};
String.prototype.is = function (str: string): boolean {
    return this.toString() === str;
};
String.prototype.emptyThen = function (str: string): string {
    if (this.toString() === '') {
        return str;
    }
    return this.toString();
};
Number.prototype.is = function (int: number): boolean {
    return this === int;
};
