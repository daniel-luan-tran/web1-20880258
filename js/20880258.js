const apiRootUrl = 'https://web1-api.vercel.app/api';
async function loadData(request, templateId, viewId) {
    const res = await fetch(`${apiRootUrl}/${request}`);
    
    const data = await res.json();
    var source = document.getElementById(`${templateId}`).innerHTML;
    var template = Handlebars.compile(source);

    var context = { [`${viewId.replace("-", "")}`]: data };
    var productsView = document.getElementById(`${viewId}`);
    console.log(template(context))
    productsView.innerHTML = template(context);
};