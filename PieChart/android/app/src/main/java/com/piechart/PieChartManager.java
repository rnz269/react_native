package com.piechart;

import android.graphics.Color;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;

public class PieChartManager extends SimpleViewManager<PieChartView> {
    // determines the name of the component within our JavaScript
    private static final String REACT_CLASS = "PieChart";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected PieChartView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new PieChartView(reactContext);
    }

    // Methods of PieChartManager like the following handle updating the PieChartView to reflect the latest props
    // props are updated, and then view.invalidate is called to force a re-draw
    @ReactProp(name = "data")
    public void setData(PieChartView view, @Nullable ReadableArray data) {
        // define an empty ArrayList (a resizable array, courtesy of java.util package) of type PieChartSlice, store in var slices
        ArrayList<PieChartSlice> slices = new ArrayList<>();
        // for each object in data array, will convert types from JS to java, then add to slices array
        for (int i = 0; i < data.size(); i++) {
            ReadableMap item = data.getMap(i);

            int color = item.getInt("color");
            float value = (float) item.getDouble("value");

            slices.add(new PieChartSlice(color, value));
        }

        view.slices = slices.toArray(new PieChartSlice[data.size()]);
        // invalidate forces PieChartView to redraw
        view.invalidate();
    }

    @ReactProp(name = "strokeWidth", defaultFloat = 0f)
    public void setStrokeWidth(PieChartView view, float strokeWidth) {
        view.strokeWidth = strokeWidth;

        view.invalidate();
    }

    @ReactProp(name = "strokeColor")
    public void setStrokeColor(PieChartView view, @Nullable String strokeColor) {
        view.strokeColor = Color.parseColor(strokeColor);

        view.invalidate();
    }

}
