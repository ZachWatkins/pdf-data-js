function component() {
    const element = document.createElement('ol');
    element.innerHTML = `<li><a href="https://www.dol.gov/sites/dolgov/files/WB/media/stats/nationaldatabaseofchildcareprices.xlsx">https://www.dol.gov/sites/dolgov/files/WB/media/stats/nationaldatabaseofchildcareprices.xlsx</a></li>
        <li><a href="https://www.dol.gov/sites/dolgov/files/WB/media/NationalDatabaseofChildcarePricesTechnicalGuideFinal.pdf">https://www.dol.gov/sites/dolgov/files/WB/media/NationalDatabaseofChildcarePricesTechnicalGuideFinal.pdf</a></li>
        <li><a href="https://www.dol.gov/agencies/wb/topics/childcare">https://www.dol.gov/agencies/wb/topics/childcare</a></li>
        <li><a href="https://www.childandfamilydataarchive.org/cfda/archives/CFDA/studies/38303/versions/V1">https://www.childandfamilydataarchive.org/cfda/archives/CFDA/studies/38303/versions/V1</a></li>`;
    return element;
}

const heading1 = document.createElement('h1');
heading1.innerHTML = 'Childcare Fact Sheet';

const heading2 = document.createElement('h2');
heading2.innerHTML = 'Resources';

document.body.appendChild(heading1);
document.body.appendChild(heading2);
document.body.appendChild(component());
