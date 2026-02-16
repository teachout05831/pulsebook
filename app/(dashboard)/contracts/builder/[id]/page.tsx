import { ContractBuilderLoader } from '@/features/contracts/components/ContractBuilderLoader'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContractBuilderPage({ params }: Props) {
  const { id } = await params
  return <ContractBuilderLoader templateId={id} />
}
