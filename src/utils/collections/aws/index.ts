const regionWithImage: any = {
  'ap-southeast-1': 'singapore',
  'ap-south-1': 'india',
  'ap-northeast-2': 'south-korea',
  'eu-north-1': 'sweden',
  'ap-northeast-1': 'japan',
  'ap-southeast-2': 'australia',
  'eu-central-1': 'germany',
  'eu-west-3': 'france',
  'eu-west-2': 'united-kingdom',
  'us-west-2': 'usa',
  'us-east-2': 'usa',
  'us-east-1': 'usa',
  'ca-cental-1': 'canada'
}

export const regionWithCountry: any = {
  'ap-southeast-1': 'Singapore',
  'ap-south-1': 'Mumbai',
  'ap-northeast-2': 'Seoul',
  'eu-north-1': 'Stockholm',
  'ap-northeast-1': 'Tokyo',
  'ap-southeast-2': 'Sydney',
  'eu-central-1': 'Frankfurt',
  'eu-west-3': 'Paris',
  'eu-west-2': 'London',
  'us-west-2': 'Oregon',
  'us-east-3': 'Ohio',
  'us-east-1': 'Virginia',
  'ca-cental-1': 'Montreal'
}

export const genLocationImageByAWSRegion = (region = '') => {
  return `/imgs/aws/${regionWithImage[region]}.png`
}

export const genAWSShortNameZone = (zoneName = '') => {
  return zoneName?.charAt(zoneName?.length - 1)?.toUpperCase()
}

export const genAWSImageBlueprint = (blueprintId: string) => {
  const list = [
    'wordpress',
    'lamp',
    'node',
    'joomla',
    'magento',
    'mean',
    'drupal',
    'gitlab',
    'redmine',
    'nginx',
    'ghost',
    'django',
    'prestashop',
    'plesk_ubuntu',
    'cpanel_whm',
    'amazon_linux',
    'ubuntu',
    'debian',
    'freebsd',
    'opensuse',
    'alma_linux',
    'centos_stream_9',
    'sql',
    'windows_server'
  ]
  const fileName = list?.find((e) => blueprintId?.includes(e) || blueprintId === e)

  return `/imgs/aws/${fileName}.png`
}
