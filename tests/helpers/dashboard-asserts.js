import { findAll } from '@ember/test-helpers';

export const assertGlobalDetails = (assert, parent = '.dashboard__global-case-details') => {
  const casesTotal = '3,227,909';
  const fatalTotal = '232,990';

  assert
    .dom(`${parent} .case-details__metric-value__confirmed`)
    .hasText(casesTotal, 'Case details are correct for total cases');

  assert
    .dom(`${parent} .case-details__metric-value__fatal`)
    .hasText(fatalTotal, 'Case details are correct for total fatal cases');
};

export const assertBreakdownTable = (assert, values) => {
  const { rows } = values;

  if (rows?.length) {
    rows.forEach(({ title, value }, idx) => {
      const row = idx + 1;
      assert
        .dom(`.location-table__list li:nth-of-type(${row}) div`)
        .hasText(title, `Breakdown table shows the correct title in row ${row}`);
      assert
        .dom(`.location-table__list li:nth-of-type(${row}) span`)
        .hasText(value, `Breakdown table shows the correct value in row ${row}`);
    });
  } else {
    assert.dom(`.location-table__empty`).exists('Breakdown table show no data indicator');
  }
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

  if (wikiId) {
    assert
      .dom('.dashboard__map-details-header__wiki-link')
      .hasAttribute('href', `https://en.wikipedia.org/wiki/${wikiId}`, 'A location has the correct wiki link');
  } else {
    assert.dom('.dashboard__map-details-header__wiki-link').doesNotExist('A location does not have a wiki link');
  }
};

export const assertLocationCaseDetails = (assert, values) => {
  const { casesTotal, fatalTotal, recoveredTotal } = values;
  const parent = '.dashboard__location-case-details';

  assert
    .dom(`${parent} .case-details__metric-value__confirmed`)
    .hasText(casesTotal, 'Case details are correct for total cases');

  assert
    .dom(`${parent} .case-details__metric-value__fatal`)
    .hasText(fatalTotal, 'Case details are correct for total fatal cases');

  assert
    .dom(`${parent} .case-details__metric-value__recovered`)
    .hasText(recoveredTotal, 'Case details are correct for total recovered cases');
};

export const assertTitle = (assert, location) => {
  const title = document.querySelector('head title').textContent;
  assert.equal(
    title,
    `${location} - COVID-19 Dashboard - Yahoo Knowledge Graph`,
    'Page title matches the expected title'
  );
};
