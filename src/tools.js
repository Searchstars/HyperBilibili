export function ParseSetCookie(a) {
    var arr = a.replace(/expires=(.*?)GMT/g,function($1) {
        return "expires=" + new Date($1).getTime();
    }).split(", ");
 
    var cookies = [];
	for(var i=0;i<arr.length;i++)
	{
		let cookie = parse(/([^=;\s]+)=([^;]+);?/g, arr[i].replace(/; httponly/g, "$&=true"));
		cookies.push(cookie);
	}
    function parse(reg, text) {
        if (!reg || !text) return {}
        const hash = {};
        let res = reg.exec(text);
        while (res !== null) {
            hash[res[1]] = res[2];
            res = reg.exec(text);
        }
        return hash;
    }
    return cookies;
}

export function formatNumber(num){
    if(num < 1000){
        return num.toString();
    }
    else if(num < 10000){
        return (num/1000).toFixed(1) + 'k';
    }
    else{
        return (num / 10000).toFixed(1) + 'w'
    }
}

export function calculateDivHeightAndMargin(text, screenWidth = 480, divWidthPercentage = 0.75, fontSize = 20) {
  const divWidth = screenWidth * divWidthPercentage; // 计算div的宽度
  const charWidth = fontSize / 2; // 假设每个字符的宽度
  const charsPerLine = Math.floor(divWidth / charWidth); // 每行可容纳的字符数
  const lines = Math.ceil(text.length / charsPerLine); // 总行数
  const divHeight = lines * fontSize; // div的总高度

  console.log(`Div Height: ${divHeight}px`);
  console.log(`Lines: ${lines}`);
  return divHeight; // 这个高度可以用来设置第二个div的margin-top
}
