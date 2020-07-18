package com.piechart;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.util.DisplayMetrics;
import android.view.View;

// CLASS DEFINITION: PieChartSlice
class PieChartSlice {

    int color;

    float value;

    // PieChartSlice constructor
    PieChartSlice(int color, float value) {
        this.color = color;
        this.value = value;
    }
}

// CLASS DEFINITION: PieChartView
public class PieChartView extends View {
    // FIELDS
    public float strokeWidth = 0;
    public int strokeColor = Color.TRANSPARENT;
    // looks like we're defining a field: array of PieChartSlice(s), and we create slots to hold 0 PieChartSlice instances
    // this 0, along with transparent for strokeColor and 0 for strokeWidth represent default values
    public PieChartSlice[] slices = new PieChartSlice[0];

    // private means can only access within this class
    // instantiate two new objects from Paint class (imported): fill and stroke
    private Paint fill = new Paint();
    private Paint stroke = new Paint();
    private DisplayMetrics metrics;

    // METHODS
    // PieChartView constructor
    public PieChartView(Context context) {
        // calls parent's class constructor and runs before the current class's constructor
        super(context);

        metrics = getResources().getDisplayMetrics();

        fill.setAntiAlias(true);
        fill.setDither(true);
        fill.setStyle(Paint.Style.FILL);

        stroke.setAntiAlias(true);
        stroke.setDither(true);
        stroke.setStyle(Paint.Style.STROKE);
    }

    // Above, we define constructor, and member variables. Below, we operate on these fields using methods to determine behavior.
    // draw method also exists in View, but we're overriding it here in PieChartView
    @Override
    public void draw(Canvas canvas) {
        // super refers to View class we're extending -- we're calling View.draw
        super.draw(canvas);

        float strokeWidth = this.strokeWidth * metrics.density;
        // instantiate an object from class RectF called rect
        RectF rect = new RectF(0, 0, getWidth(), getHeight());
        rect.inset(strokeWidth / 2, strokeWidth / 2);

        float centerX = rect.centerX();
        float centerY = rect.centerY();

        float total = 0;

        for (PieChartSlice slice : slices) {
            total += slice.value;
        }

        if (total <= 0) {
            return;
        }

        float value = 0;

        for (PieChartSlice slice : slices) {
            fill.setColor(slice.color);

            Path path = new Path();
            path.moveTo(centerX, centerY);
            path.addArc(rect, (value * 360) - 90, (slice.value / total) * 360);
            path.lineTo(centerX, centerY);

            canvas.drawPath(path, fill);

            value += slice.value / total;
        }

        stroke.setStrokeWidth(strokeWidth);
        stroke.setColor(strokeColor);

        for (PieChartSlice slice : slices) {
            fill.setColor(slice.color);

            Path path = new Path();
            path.moveTo(centerX, centerY);
            path.addArc(rect, (value * 360) - 90, (slice.value / total) * 360);
            path.lineTo(centerX, centerY);

            canvas.drawPath(path, stroke);

            value += slice.value / total;
        }
    }
}
