type ZoneType = {
  displayName: string
  name: string
}

type RegionType = {
  availabilityZones: ZoneType[]
  continentCode: string
  description: string
  displayName: string
  name: string
  relationalDatabaseAvailabilityZones: any[]
  icon: string
}

type BlueprintType = {
  appCategory: any
  blueprintId: string
  description: string
  group: string
  isActive: boolean
  licenseUrl: string
  minPower: number
  name: string
  platform: string
  productUrl: string
  type: string
  version: string
  versionCode: string
}

type BundleType = {
  bundleId: string
  cpuCount: number
  diskSizeInGb: number
  instanceType: string
  isActive: boolean
  name: string
  power: number
  price: number
  publicIpv4AddressCount: number
  ramSizeInGb: number
  supportedAppCategories: any
  supportedPlatforms: string[]
  transferPerMonthInGb: number
}

type AWSLightSailInstanceType = {
  _id: string
  addOns: any
  arn: string
  blueprintId: string
  blueprintName: string
  bundleId: string
  hardware: {
    cpuCount: number
    disks: [
      {
        attachedTo: string
        attachmentState: string
        createdAt: number
        iops: number
        isSystemDisk: true
        path: string
        sizeInGb: number
      }
    ]
    ramSizeInGb: number
  }
  ipAddressType: string
  ipv6Addresses: string[]
  isStaticIp: false
  location: {
    availabilityZone: string
    regionName: string
  }
  metadataOptions: {
    httpEndpoint: string
    httpProtocolIpv6: string
    httpPutResponseHopLimit: number
    httpTokens: string
    state: string
  }
  name: string
  networking: {
    monthlyTransfer: {
      gbPerMonthAllocated: number
    }
    ports: {
      accessDirection: string
      accessFrom: string
      accessType: string
      cidrListAliases: []
      cidrs: string[]
      commonName: string
      fromPort: number
      ipv6Cidrs: string[]
      protocol: string
      toPort: number
    }[]
  }
  privateIpAddress: string
  resourceType: string
  sshKeyName: string
  state: {
    code: number
    name: string
  }
  supportCode: string
  tags: any[]
  username: string
  createdAt: number
  publicIpAddress: string
}

type CreateAWSInstanceType = {
  pay_method: number
  region: string
  availabilityZone: string
  blueprintId: string
  bundleId: string
}

export type { AWSLightSailInstanceType, BlueprintType, BundleType, CreateAWSInstanceType, RegionType, ZoneType }
