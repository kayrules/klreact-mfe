import { useEffect, useState } from 'react';
import { useCarouselWidth } from "@klreact-mfe/mfe-ui";
import { getBreakpoint } from './getBreakpoint';

const maxCarouselWidth = 1425;
const maxCarouselHeight = 512;
const carouselCardWidth = 562;
let totalCarouselCard = 3;
let carouselImageRatio = (carouselCardWidth * totalCarouselCard) / maxCarouselHeight;
const initialHeight = maxCarouselWidth / carouselImageRatio;

export const getCarouselHeight = (carouselRef) => {
    const { width } = useCarouselWidth(carouselRef)
    const [carouselHeight, setCarouselHeight] = useState({ height: initialHeight });
    const bp = getBreakpoint();

    useEffect(() => {
        if (carouselRef.current) {
            if (bp === 'xs') totalCarouselCard = 1;
            else if (bp === 'sm') totalCarouselCard = 2;
            else totalCarouselCard = 3;
            carouselImageRatio = (carouselCardWidth * totalCarouselCard) / maxCarouselHeight;
            const carouselNewHeight = width / carouselImageRatio;
            setCarouselHeight({ height: carouselNewHeight });
        }
    }, [width]);

    return carouselHeight;
}