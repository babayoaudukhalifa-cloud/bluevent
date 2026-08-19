import { Cake, Car, Flower2, Gift, Heart, Home, PartyPopper, Trophy } from 'lucide-react'

const MAP = {
  birthday: Cake,
  wedding: Heart,
  promotion: Trophy,
  new_home: Home,
  new_car: Car,
  new_baby: Gift,
  bereavement: Flower2,
  work_anniversary: PartyPopper,
}

export default function OccasionIcon({ type, size = 18 }) {
  const Icon = MAP[type] || Gift
  return <Icon size={size} />
}
