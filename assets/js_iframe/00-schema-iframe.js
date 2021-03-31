//this nofifies the parent on iframe is ready
$(document).ready(function() {	
	
	enableSendingMessages();
	sendPageNavData();	
	sendPageTitle();
});

//listen to message from parent and scrollst to the index marker requested
window.addEventListener("message", function (event) {		
	if (event.data.scrollToAnchor) {	
		const anchor = $("#" + event.data.scrollToAnchor.anchor);
		if(typeof anchor.offset() === "undefined"){
			return;
		}
		$("html,body").scrollTop(anchor.offset().top);
	}
});

//bind message sending to links to notify parent of clicks
function enableSendingMessages() {	
	$('a.schema-iframe-link').click(function (e) {		
		e.preventDefault();
		const nodeId = retrieveDataSetFieldIEWorkaround(e.currentTarget, "nodeId");		
		var anchorSplit = [];
		if(typeof e.currentTarget.href.baseVal !== "undefined"){
			anchorSplit = e.currentTarget.href.baseVal.split("#");
		}
		else if(typeof e.currentTarget.href.split !== "undefined"){
			anchorSplit = e.currentTarget.href.split("#");
		}
		if(anchorSplit.length > 1 && anchorSplit[1].length > 0){
			parent.postMessage({ "loadAndSyncByIndex": { "nodeId": nodeId, "anchor": anchorSplit[1] } }, "*");
		}
		else{
			parent.postMessage({ "loadAndSync": { "nodeId": nodeId } }, "*");
		}
	});
	$('a.schema-index-link').click(function (e) {
		e.preventDefault();		
		parent.postMessage({ "loadAndSyncByIndex": { "nodeId": retrieveDataSetFieldIEWorkaround(e.currentTarget, "nodeId"), "anchor": retrieveDataSetFieldIEWorkaround(e.currentTarget, "nodeAnchor") } }, "*");
	});
}

//Workaround for IE and data parameters on Callout Hotlinks
function retrieveDataSetFieldIEWorkaround(target, dataField)
{	
	if (typeof(target.dataset) !== "undefined" ) {
		return target.dataset[dataField];
	}

	let dataId = dataField.split(/(?=[A-Z])/);
	let dataName = "data-"+dataId.join("-").toLowerCase();

	return target.attributes.getNamedItem(dataName).nodeValue;
}

function sendPageNavData() {
	let meta = document.head.getElementsByTagName("meta");	
	let prev = meta.namedItem("prev");
	if (!prev)
		prev = "";
	else
		prev = prev.content;
	
	let next = meta.namedItem("next");
	if (!next)
		next = "";
	else
		next = next.content;
		
	parent.postMessage({ "pagewieseNavigation": { "prev": prev,
		"next": next }}, "*");
}

function sendPageTitle() 
{
	parent.postMessage({ "contentTitle": { "title": $("h1.heading").first().text() }}, "*");
}