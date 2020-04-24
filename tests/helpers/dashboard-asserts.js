import { findAll } from '@ember/test-helpers';

export const assertGlobalDetails = (assert, parent = '.dashboard__global-case-details') => {
  const casesTotal = '1,076,017',
    casesChange = '+1,000 | +0.1%',
    fatalTotal = '58,004',
    fatalChange = '0';

  assert.dom(`${parent} .case-details__cases-total`).hasText(casesTotal, 'Case details are correct for total cases');
  assert
    .dom(`${parent} .case-details__cases-change`)
    .hasText(casesChange, 'Case details are correct for daily total cases');

  assert
    .dom(`${parent} .case-details__table-total`)
    .hasText(fatalTotal, 'Case details are correct for total fatal cases');
  assert
    .dom(`${parent} .case-details__table-change`)
    .hasText(fatalChange, 'Case details are correct for daily fatal cases');
};

export const assertBreakdownTable = (assert, values) => {
  const { title, rows } = values;

  assert.dom('.location-table__title').hasText(title, 'Location shows correct breakdown table title');

  rows.forEach(({ title, value }, idx) => {
    const row = idx + 1;
    assert
      .dom(`.location-table__list li:nth-of-type(${row}) div`)
      .hasText(title, `Breakdown table shows the correct title in row ${row}`);
    assert
      .dom(`.location-table__list li:nth-of-type(${row}) span`)
      .hasText(value, `Breakdown table shows the correct value in row ${row}`);
  });
};

export const assertBreadCrumb = (assert, values) => {
  const anchors = findAll('.breadcrumb a');

  assert.equal(anchors.length, values.length, 'Number of breadcrumb items is correct');
  values.forEach(({ title, href }, idx) => {
    assert.dom(anchors[idx]).hasText(title, 'Breadcrumb has the correct display text');
    assert.dom(anchors[idx]).hasAttribute('href', href, 'Breadcrumb has the correct href');
  });
  assert.dom(anchors[anchors.length - 1]).hasClass('active', 'Right most breadcrumb is displayed as active');
};

export const assertMap = (assert, values) => {
  const { markerCount, showPin } = values;

  assert
    .dom('.location-marker')
    .exists({ count: markerCount }, 'A location displays correct number of location markers on the map');
  assert
    .dom('.map__marker-icon')
    .exists({ count: showPin ? 1 : 0 }, 'A location displays the correct number of pins on the map');
};

export const assertLocationDetails = (assert, values) => {
  const { title, population, wikiId } = values;

  assert.dom('.dashboard__map-details-header__title').hasText(title, 'A location shows correct details title');
  assert
    .dom('.dashboard__map-details__population-count')
    .hasText(population, 'A location shows correct population value');
  assert
    .dom('.dashboard__map-details-header__wiki-link')
    .hasAttribute('href', `https://en.wikipedia.org/wiki/${wikiId}`, 'A location has the correct wiki link');
};

export const assertLocationCaseDetails = (assert, values) => {
  const {
    casesTotal,
    casesChange,
    activeTotal,
    activeChange,
    fatalTotal,
    fatalChange,
    recoveredTotal,
    recoveredChange,
  } = values;
  const parent = '.dashboard__location-case-details';

  assert.dom(`${parent} .case-details__cases-total`).hasText(casesTotal, 'Case details are correct for total cases');
  assert
    .dom(`${parent} .case-details__cases-change`)
    .hasText(casesChange, 'Case details are correct for daily total cases');

  assert
    .dom(`${parent} .case-details__table-col--active .case-details__table-total`)
    .hasText(activeTotal, 'Case details are correct for total active cases');
  assert
    .dom(`${parent} .case-details__table-col--active .case-details__table-change`)
    .hasText(activeChange, 'Case details are correct for daily active cases');

  assert
    .dom(`${parent} .case-details__table-col--fatal .case-details__table-total`)
    .hasText(fatalTotal, 'Case details are correct for total fatal cases');
  assert
    .dom(`${parent} .case-details__table-col--fatal .case-details__table-change`)
    .hasText(fatalChange, 'Case details are correct for daily fatal cases');

  assert
    .dom(`${parent} .case-details__table-col--recovered .case-details__table-total`)
    .hasText(recoveredTotal, 'Case details are correct for total recovered cases');
  assert
    .dom(`${parent} .case-details__table-col--recovered .case-details__table-change`)
    .hasText(recoveredChange, 'Case details are correct for daily recovered cases');
};

export const assertTitle = (assert, location) => {
  const title = document.querySelector('head title').textContent;
  assert.equal(
    title,
    `${location} - Covid-19 Tracker - Yahoo Knowledge Graph`,
    'Page title matches the expected title'
  );
};
