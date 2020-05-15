let params = {};


function getTimeDiff(et, st) {
	let startTime = new Date(st);
	let endTime = new Date(et);

	let diff = endTime.getTime() - startTime.getTime();
	diff = Math.ceil(diff / 1000);

	return diff;
}

function getFormData(f) {
	let d = new FormData(f), data = {};
	for(let [i, v] of d.entries()) {
		data[i] = v;
    }
	return data;
}

function getParams() {
	let p = window.location.search.substring(1);
	for(param of p.split("&")) {
		let v = param.split("=");
		params[v[0]] = v[1];
	}
}

getParams();