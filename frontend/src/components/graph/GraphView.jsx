import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import NodeDrawer from './NodeDrawer'

export default function GraphView({ nodes = [], edges = [], gaps = [] }) {
  const svgRef = useRef()
  const [selected, setSelected] = useState(null)
  const gapSet = new Set(gaps.map(g => g.skill?.toLowerCase()))

  useEffect(() => {
    if (!nodes.length) return
    const el = svgRef.current
    const W = el.clientWidth || 700
    const H = 340
    d3.select(el).selectAll('*').remove()
    const svg = d3.select(el).attr('width', W).attr('height', H)

    svg.append('defs').append('marker')
      .attr('id', 'arrow').attr('viewBox', '0 0 10 10')
      .attr('refX', 22).attr('refY', 5)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path').attr('d', 'M2 1L8 5L2 9')
      .attr('fill', 'none').attr('stroke', '#1F2D45')
      .attr('stroke-width', 1.5).attr('stroke-linecap', 'round')

    const linkData = edges.map(e => ({ source: e.from, target: e.to }))
    const nodeData = nodes.map(id => ({ id }))

    const sim = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(40))

    const link = svg.append('g').selectAll('line').data(linkData).join('line')
      .attr('stroke', '#1F2D45').attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)')

    const node = svg.append('g').selectAll('g').data(nodeData).join('g')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
        .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null })
      )
      .on('click', (e, d) => {
        e.stopPropagation()
        const gap = gaps.find(g => g.skill?.toLowerCase() === d.id?.toLowerCase())
        setSelected({ id: d.id, gap })
      })

    node.append('circle').attr('r', 28)
      .attr('fill', d => gapSet.has(d.id?.toLowerCase()) ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)')
      .attr('stroke', d => gapSet.has(d.id?.toLowerCase()) ? '#EF4444' : '#10B981')
      .attr('stroke-width', 1.5)

    node.filter(d => gapSet.has(d.id?.toLowerCase()))
      .append('circle').attr('r', 28).attr('fill', 'none')
      .attr('stroke', '#EF4444').attr('stroke-width', 2).attr('opacity', 0.5)
      .each(function () {
        const el = d3.select(this)
        const pulse = () => el.attr('r', 28).attr('opacity', 0.5)
          .transition().duration(1500).attr('r', 38).attr('opacity', 0).on('end', pulse)
        pulse()
      })

    node.append('text')
      .text(d => d.id?.length > 9 ? d.id.slice(0, 8) + '\u2026' : d.id)
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('fill', d => gapSet.has(d.id?.toLowerCase()) ? '#F87171' : '#34D399')
      .attr('font-size', 11).attr('font-weight', 600).attr('font-family', 'Syne')
      .style('pointer-events', 'none')

    sim.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      node.attr('transform', d => `translate(${Math.max(30, Math.min(W-30, d.x))},${Math.max(30, Math.min(H-30, d.y))})`)
    })

    svg.on('click', () => setSelected(null))
    return () => sim.stop()
  }, [nodes, edges, gaps])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ background: '#0d1421', border: '1px solid #1F2D45', borderRadius: 14, padding: '20px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>Skill Dependency Graph</div>
            <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>Drag nodes · Click for details</div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6B7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>Gap
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>Covered
            </span>
          </div>
        </div>
        {nodes.length > 0 ? (
          <svg ref={svgRef} style={{ width: '100%', height: 340, display: 'block' }} />
        ) : (
          <div style={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', fontSize: 14 }}>
            Upload files to see your skill graph
          </div>
        )}
      </div>
      {selected && <NodeDrawer skill={selected.id} gap={selected.gap} onClose={() => setSelected(null)} />}
    </div>
  )
}
