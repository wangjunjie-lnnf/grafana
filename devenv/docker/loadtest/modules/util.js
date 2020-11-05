let token = __ENV.TOKEN;

export const createTestOrgIfNotExists = client => {
  let orgId = 0;

  // If token is set, we're trying to access hosted instance. no permissions to create org.
  // TODO this requires a separate flag to token.
  if (token) {
    client.withOrgId(orgId)
    return orgId;
  }

  let res = client.orgs.getByName('k6');

  if (res.status === 404) {
    res = client.orgs.create('k6');
    if (res.status !== 200) {
      throw new Error('Expected 200 response status when creating org');
    }
    orgId = res.json().orgId;

  } else if (res.status !== 200) {
    throw new Error(`Expected 200 response status when creating org, got ${res.status}`);

  } else {
    orgId = res.json().id;
  }

  client.withOrgId(orgId);
  return orgId;
};


export const createTestdataDatasourceIfNotExists = client => {
  const payload = {
    access: 'proxy',
    isDefault: false,
    name: 'k6-testdata',
    type: 'testdata',
  };

  let res = client.datasources.getByName(payload.name);
  if (res.status === 404) {
    res = client.datasources.create(payload);
  }

  if (res.status !== 200) {
    throw new Error(`expected 200 response status when creating datasource, got ${res.status}`);
  }

  return res.json().id;
};
