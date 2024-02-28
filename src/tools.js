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