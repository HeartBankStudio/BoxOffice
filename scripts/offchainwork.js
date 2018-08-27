import { currentOracle } from "./contracts";

const round = number => (Math.round(number * 100) / 100).toFixed(2);
const addCommas = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const makeShorter = number => {
    if (number >= 10**18) {
        return addCommas(round(number / 10**18)) + "Q"; // Quintillion
    } else if (number >= 10**15) {
        return round(number / 10**15) + "q"; // Quadrillion
    } else if (number >= 10**12) {
        return round(number / 10**12) + "T";
    } else if (number >= 10**9) {
        return round(number / 10**9) + "B";
    } else if (number >= 10**6) {
        return round(number / 10**6) + "M";
    } else if (number >= 10**3) {
        return round(number / 10**3) + "K";
    } else {
        return number | 0;
    }
}

const toEther = wei => makeShorter(wei/10**18);
const toFinney = wei => makeShorter(wei/10**15);

const toDollars = async wei => {
    const oracle = await currentOracle;
    const usdPriceOfEth = await oracle.usdPriceOfEth();
    return "$" + makeShorter(wei/10**18 * usdPriceOfEth);
}

export default makeShorter;
export { toEther, toFinney, toDollars, round, addCommas };