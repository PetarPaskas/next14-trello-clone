import { OrganizationList } from "@clerk/nextjs"

export default function CreateOrganizationPage(){

    return <OrganizationList
                hidePersonal={true}
                afterCreateOrganizationUrl="/organization/:id"
                afterSelectOrganizationUrl="/organization/:id"/>
}