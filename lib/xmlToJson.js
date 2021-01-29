// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
  }
	return obj
};

export default function normalizeXML(xml) {
  const json = xmlToJson(xml)
  const normalized = JSON.parse(JSON.stringify(json).toLowerCase()).listbucketresult
  normalized.contents = normalized.contents
    .map(content => {
      return {
        key: content.key['#text'],
        size: content.size['#text'],
        src: `https://kolib.sfo3.digitaloceanspaces.com/${encodeURIComponent(content.key['#text'])}`
      }
    })
  normalized.maxkeys = normalized.maxkeys['#text']
  normalized.prefix = normalized.prefix['#text'] || null
  normalized.marker = normalized.marker['#text'] || null
  normalized.name = normalized.name['#text'] || null
  return normalized
}