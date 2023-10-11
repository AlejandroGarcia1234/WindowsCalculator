
const operators = ["+", "-", "/", "*"];
let firstNum = true;
let numbers = [];
let operator_value;
let last_button;
let calc_operator;
let total;
const [box, history, equal, dot] = ["box", "last_operation_history", "equal_sign", "dot"].map(e => document.getElementById(e));

const key_combination = {};

const button_number = button => {
    last_button = button;
    if (!operators.includes(button) && button !== equal) {
        if (firstNum) box.innerText = (button === dot) ? "0" + dot : button;
        else if (box.innerText.length > 1 || button !== dot) box.innerText = (box.innerText.length === 1 && box.innerText === "0") ? (button === dot) ? "0" + dot : button : (box.innerText.includes(dot) && button === dot) ? box.innerText : (box.innerText.length < 20) ? (button === dot && box.innerText === "-") ? "-0" + dot : box.innerText + button : box.innerText;
        firstNum = false;
    } else {
        if (operator_value && button === operator_value) return;
        if (button === "-" && !numbers.length && box.innerText == 0) return (box.innerText = button, firstNum = false, operator_value = button, showSelectedOperator());
        if (operators.includes(button) && box.innerText === "-") return;
        if (button === "-" && operator_value === "-" && history.innerText.includes("=")) return;
        if (operators.includes(button)) calc_operator = (last_operator !== undefined) && last_operator !== null ? last_operator : button;
        last_operator = button === "*" ? "×" : button === "/" ? "÷" : button;
        operator_value = button;
        firstNum = true;
        showSelectedOperator();
        if (!numbers.length) {
            numbers.push(box.innerText);
            if (last_operator !== undefined && last_operator !== null) history.innerText = box.innerText + " " + last_operator;
        } else {
            if (numbers.length === 1) numbers[1] = box.innerText;
            const temp_num = box.innerText;
            if (button === equal && calc_operator !== null) {
                total = calculate(numbers[0], numbers[1], calc_operator);
                box.innerText = total;
                if (!history.innerText.includes("=")) history.innerText += " " + numbers[1] + " =";
                temp_num = numbers[0];
                numbers[0] = total;
                operator_value = null;
                showSelectedOperator();
                const history_arr = history.innerText.split(" ");
                history_arr[0] = temp_num;
                history.innerText = history_arr.join(" ");
            } else if (calc_operator !== null) {
                history.innerText = temp_num + " " + last_operator;
                calc_operator = button;
                numbers = [];
                numbers.push(box.innerText);
            }
        }
    }
};

const showSelectedOperator = () => {
    const elements = document.getElementsByClassName("operator");
    for (const element of elements) element.style.backgroundColor = "#e68a00";
    const colorMap = { "+": "plusOp", "-": "subOp", "*": "multiOp", "/": "divOp" };
    document.getElementById(colorMap[operator_value] || "").style.backgroundColor = "#ffd11a";
};

const calculate = (num1, num2, operator) => {
    switch (operator) {
        case "+": return parseFloat(num1) + parseFloat(num2);
        case "-": return parseFloat(num1) - parseFloat(num2);
        case "*": return parseFloat(num1) * parseFloat(num2);
        case "/": return parseFloat(num1) / parseFloat(num2);
        default: return (total === box.innerText) ? total : box.innerText;
    }
};

const button_clear = () => window.location.reload();

const backspace_remove = () => {
    box.innerText = (box.innerText.slice(0, -1) || 0);
    firstNum = (box.innerText.length === 0);
};

const plus_minus = () => {
    if (operator_value && numbers.length) {
        if (operators.includes(last_button)) {
            if (box.innerText === "-") {
                box.innerText = 0;
                firstNum = true;
            } else box.innerText = (box.innerText === 0) ? "-" : -box.innerText;
            if (numbers.length === 1) numbers[0] = box.innerText;
            else numbers[1] = box.innerText;
        }
    } else box.innerText = (box.innerText === 0) ? "-" : -box.innerText;
};

const square_root = () => box.innerText = Math.sqrt(box.innerText);

const division_one = () => box.innerText = 1 / box.innerText;

const power_of = () => box.innerText = Math.pow(box.innerText, 2);

const calculate_percentage = () => {
    if (numbers.length && last_operator) box.innerText = (last_operator === "+" || last_operator === "-") ? (numbers * box.innerText) / 100 : (box.innerText / 100);
    else box.innerText /= 100;
    numbers = [box.innerText];
    for (const element of document.getElementsByClassName("operator")) element.style.backgroundColor = "#e68a00";
};

const clear_entry = () => (numbers.length && last_operator) ? (box.innerText = 0, numbers = [numbers[0]], firstNum = true) : undefined;

document.addEventListener('keydown', e => {
    e.preventDefault();
    const button = e.key === "Enter" ? equal : e.key === "." ? dot : isFinite(e.key) ? e.key : undefined;
    if (button) button_number(button);
    if (e.key === "Backspace") {
        document.getElementById("backspace_btn").style.backgroundColor = "#999999";
        backspace_remove();
    }
    key_combination[e.code] = e.key;
});

document.addEventListener('keyup', e => {
    if (key_combination['ControlLeft'] === 'v') navigator.clipboard.readText().then(text => (isFinite(text)) && button_number(text)).catch(err => console.error('Failed to read clipboard contents: ', err));
    if (key_combination['ControlLeft'] === 'c') navigator.clipboard.writeText(box.innerText);
    delete key_combination[e.code];
    if (e.key === "Backspace") document.getElementById("backspace_btn").style.backgroundColor = "#666666";
});
